const LogButton = angular.module('LogButton', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

LogButton.controller('LogButton', function ($scope, $window, MemberService) {
    $scope.firebase = firebase;
    $scope.userLoggedIn = false;
    $scope.data = {};
    $scope.user = {};

    this.$onInit = function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // console.log("user",user )
                $scope.userLoggedIn = true;
                $scope.user.full_name = 'Welcome...'

                user.getIdToken(true).then(function (idToken) {
                    //console.log("idToken",idToken )
                    $scope._id = {
                        _id: user.uid
                    }
                    MemberService.getUsersById(idToken,  $scope._id ).then(function (results) {
                        $scope.user = results.data
                        // console.log(" $scope.user",$scope.user )
                        $scope.user.mycountry=$scope.user.countryData.country.toLowerCase().replace(/\s+$/, '').replace(' ','-')
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
                $scope.userLoggedIn = false;
                $scope.$apply();
            }
        });
    };

    $scope.profile = function() {
        console.log("in profile")
        if($scope.userLoggedIn){
            var url =  decodeURIComponent(Routing.generate('my-profile'))
            $window.location= url
        }
        else{
            $('.modal_sigh-up').slideDown();
        }

    }

    $scope.logout = function(){
        firebase.auth().signOut();

        if(window.location.pathname.indexOf('market-forecast')>-1 ||
            window.location.pathname.indexOf('best-forex-traders')>-1 ||
            window.location.pathname.indexOf('traders-profile')>-1 ||
            window.location.pathname.indexOf('my-profile')>-1)
        {
            //console.log('yes',window.location.pathname)
            var url =  decodeURIComponent(Routing.generate('Live_rates_stocks', { 'name': 'United-States','value':'united-states-of-america'}))
            // var url =  decodeURIComponent(Routing.generate('/'))
            $window.location= url
        }
        else{
            //console.log('no')
            $window.location.reload();
        }
    }
});


const dvLogButton = document.getElementById('dvLogButton');

angular.element(document).ready(function () {

    angular.bootstrap(dvLogButton, ['LogButton']);

});

//*************************************************************************************//

const SentimentLink = angular.module('SentimentLink', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

SentimentLink.controller('SentimentLinkCtr', function ($scope, $window, MemberService) {

    this.$onInit = function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $scope.userLoggedIn = true;
                $scope.$apply();
            }
            else{
                $scope.userLoggedIn = false;
                $scope.$apply();
            }
        });
    };

    $scope.GoToSentimentPage = function (_locale) {
        if($scope.userLoggedIn){
            var url =  decodeURIComponent(Routing.generate('social_sentiment',{"_locale": _locale}))
            $window.location= url
        }
        else{
            $('.modal_sigh-up').slideDown();
        }
    }

    $scope.GoToLeaderboardPage = function (_locale) {
        if($scope.userLoggedIn){
            var url =  decodeURIComponent(Routing.generate('leaderboard',{"_locale": _locale}))
            $window.location= url
        }
        else{
            $('.modal_sigh-up').slideDown();
        }
    }
})



const dvSentimentLink = document.getElementById('dvSentimentLink');

angular.element(document).ready(function () {

    angular.bootstrap(dvSentimentLink, ['SentimentLink']);

});


//*************************************************************************************//
const ChatLive = angular.module('ChatLive', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

ChatLive.controller('ChatLiveCtr', function ($scope, $http, MemberService) {

    $scope.socket = io.connect("https://xosignals.herokuapp.com/", { path: "/socket/trading-compare-v2/chat" });

    $scope.is_typing = false

    this.$onInit = function () {

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $scope.userLoggedIn = true;
                user.getIdToken(true).then(function (idToken) {
                    $scope._id = {
                        _id: user.uid
                    }
                    MemberService.getUsersById(idToken,  $scope._id ).then(function (results) {
                        $scope.user = results.data
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
                //console.log(" no user")
                $scope.userLoggedIn = false;
                $scope.socket.emit("chat_room", {
                    nickname: 'undefined',
                    room: 'all'
                });
                $scope.$apply();
            }
        });
    };

    // COMMENTS
    $http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-comments/all")
        .then(function(response) {
            $scope.all_comments_total = response.data.reverse()
            //console.log("**init $scope.all_comments_total **",$scope.all_comments_total )
        },function errorCallback(response) {
            console.log("**error**","$scope.all_comments", $scope.all_comments)
        });


    $scope.post_message = function(){
        //console.log('post_message')
        if($scope.userLoggedIn && $scope.the_comment!=undefined){
            $scope.data = {
                nickname: $scope.user.nickname,
                txt: $scope.the_comment,
                symbol: 'all',
                user_id: $scope.user._id,
                country: $scope.user.countryData.country.toLowerCase(),
            }
            //console.log('data send to post', $scope.data)
            $scope.socket.emit("message",$scope.data);

            $scope.data["date_from_now"] = 'a few seconds'
            $scope.all_comments_total.unshift($scope.data)
            $scope.the_comment = ''
        }
        else if(!$scope.userLoggedIn && $scope.the_comment!=undefined){
            console.log('****',$scope.the_comment)
            $('.modal_sigh-up').slideDown();
        }
        else{
            return;
        }

    }

    $scope.typing = function(){
        // $scope.is_typing = true
        $scope.socket.emit("typing","all");
    }

    //WEB-SOCKET COMMENT
    $scope.socket.on("on_typing", (data) => {
        if ($scope.socket.id != data.id) {
            // console.log('in on_typing')

            if($scope.is_typing == false){
                $scope.is_typing = true;
                $scope.$apply();
            }

            setTimeout(() => {
                $scope.is_typing = false;
                $scope.$apply();
            }, 3000)
        }
    // }
});

    $scope.socket.on("on_message", (data) => {
        console.log('data received',data)
        if ($scope.socket.id != data.id) {

            if(data.country.indexOf(" ")>-1){
                data.country = data.country.replace(/ /g, "-");
            }
            data["date_from_now"] = 'a few seconds'
            $scope.all_comments_total.unshift(data)
            $scope.$apply();
        }
    });

})

const dvChatLive = document.getElementById('dvChatLive');

angular.element(document).ready(function () {

    angular.bootstrap(dvChatLive, ['ChatLive']);

});