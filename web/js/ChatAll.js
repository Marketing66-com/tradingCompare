var SocialApp = angular.module('stockApp', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

SocialApp.controller("SocialController", function ($scope, $http, MemberService) {
    $scope.tab = 1;
    $scope.the_comment = ''
    $scope.is_typing = false

    // WEBSOCKET COMMENT
    $scope.socket = io.connect("https://xosignals.herokuapp.com/", { path: "/socket/trading-compare-v2/chat" });

    $scope.init = function () {

        // LOGIN
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                //console.log("user",user )
                $scope.userLoggedIn = true;
                user.getIdToken(true).then(function (idToken) {
                    //console.log("idToken",idToken )
                    $scope._id = {
                        _id: user.uid
                    }
                    MemberService.getUsersById(idToken,  $scope._id ).then(function (results) {
                        $scope.user = results.data
                        //console.log(" $scope.user",$scope.user )

                        $scope.socket.emit("chat_room", {
                            nickname: $scope.user.nickname,
                            room: "all"
                        });

                        $scope.$apply();

                    }).catch(function (error) {
                        $scope.data = error;
                        console.log("$scope.data", $scope.data)
                        $scope.$apply();
                    })

                }).catch(function (error) {
                    console.log('ERROR: ', error)
                });
                $scope.$apply();
            }
            else{
                console.log(" no user")
                $scope.userLoggedIn = false;
                $scope.socket.emit("chat_room", {
                    nickname: 'undefined',
                    room: 'all'
                });
                $scope.$apply();
            }
        });

        // COMMENTS
        $http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-comments/all")
            .then(function(response) {
                $scope.all_comments_total = response.data.reverse();
                //console.log("**init $scope.all_comments_total **",$scope.all_comments_total )

                $scope.itemsPerPage_comments = 10;
                $scope.currentPage_comments = 0;
                $scope.total_comments = $scope.all_comments_total.length;
                $scope.all_comments =  $scope.offset_comments($scope.currentPage_comments * $scope.itemsPerPage_comments, $scope.itemsPerPage_comments);

            },function errorCallback(response) {
                console.log("**error**","$scope.all_comments", $scope.all_comments)
            });

    }

    /********* TAB *********/
    // $scope.setTab = function(newTab){
    //     $scope.tab = newTab;
    // };
    //
    // $scope.isSet = function(tabNum){
    //     return $scope.tab === tabNum;
    // };
    //
    // /********* COMMENTS *********/
    // $scope.offset_comments = function(offset, limit) {
    //     return  $scope.all_comments_total.slice(offset, offset+limit);
    // }
    //
    // $scope.loadMore_comments = function() {
    //     $scope.currentPage_comments++;
    //     var newItems = $scope.offset_comments($scope.currentPage_comments*$scope.itemsPerPage_comments,
    //         $scope.itemsPerPage_comments);
    //     $scope.all_comments = $scope.all_comments.concat(newItems);
    // };
    //
    // $scope.nextPageDisabledClass_comments = function() {
    //     if ($scope.currentPage_comments === $scope.pageCount_comments()-1){
    //         $scope.disabled_comments = {
    //             'background-color': '#9B9B9B',
    //             "color" : "white",
    //             'border':'none'
    //         }
    //     }
    //     return $scope.currentPage_comments === $scope.pageCount_comments()-1 ? "disabled" : "";
    // };
    //
    // $scope.pageCount_comments = function() {
    //     return Math.ceil($scope.total_comments/$scope.itemsPerPage_comments);
    // };

    // POST COMMENT
    $scope.post_message = function(){
        console.log('post_message')
        $scope.data = {
            nickname: $scope.user.nickname,
            txt: $scope.the_comment,
            symbol: $scope.symbol,
            user_id: $scope.user._id,
            country: $scope.user.countryData.country.toLowerCase(),
        }
        //console.log('data send to post', $scope.data)
        $scope.socket.emit("message",$scope.data);
        $scope.all_comments.unshift($scope.data)
        $scope.the_comment = ''
    }

    $scope.typing = function(){
        // $scope.is_typing = true
        $scope.socket.emit("typing", "all");
    }

    $scope.click_on_post = function(){
        $('.modal_sigh-up').slideDown();
    }

    //WEB-SOCKET COMMENT
    $scope.socket.on("on_typing", (data) => {
        if ($scope.socket.id != data.id) {
            // console.log('in on_typing')
            // console.log('1', $scope.is_typing )
            if($scope.is_typing == false){
                $scope.is_typing = true;
                $scope.$apply();
            }

            // console.log('2', $scope.is_typing )
            setTimeout(() => {
                $scope.is_typing = false;
                // console.log('3', $scope.is_typing )
                $scope.$apply();
            }, 3000)
            // }
        }
    });

    $scope.socket.on("on_message", (data) => {
        //console.log('data received',data)
        if ($scope.socket.id != data.id) {
            //console.log('in if')
            data.country = data.country.replace(" ", "-");
            $scope.all_comments.unshift(data)
            //console.log($scope.all_comments)
            $scope.$apply();
        }
    });


});

var dvSocial = document.getElementById('dvSocial');

angular.element(document).ready(function() {

    angular.bootstrap(dvSocial, ['stockApp']);
});


