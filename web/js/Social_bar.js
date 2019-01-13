var SocialApp = angular.module('stockApp', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

SocialApp.controller("SocialController", function ($scope, $http, MemberService) {
    $scope.all_news = []
    $scope.tab = 1;
    $scope.the_comment = ''
    $scope.symbol
    $scope.is_typing = false

    // WEBSOCKET COMMENT
    $scope.socket = io.connect("https://xosignals.herokuapp.com/", { path: "/socket/trading-compare-v2/chat" });

    $scope.init = function (symbol) {
        $scope.symbol = symbol

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
                            room: symbol
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
                    room: symbol
                });
                $scope.$apply();
            }
        });

        // COMMENTS
        $http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-comments/"+ symbol)
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

        // NEWS
        $http.get("https://api.iextrading.com/1.0/stock/"+ symbol +"/news")
            .then(function(response) {
                //console.log("**init news**",response.data)
                $scope.all_news = response.data;

                $scope.all_news.forEach(element => {
                    $scope.news_date = new Date (element.datetime)
                    element.date =  $scope.news_date.toDateString().substring(4).split(' ').join(',').replace(',',' ').replace('0','').replace(',',', ') + " " +
                        $scope.news_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                });
            },function errorCallback(response) {
                console.log("**error**","$scope.all_news")
        });

        // TWEETS
        $http.get("https://xosignals.herokuapp.com/search/"+ symbol +"/en")
            .then(function(response) {
                $scope.all_tweets_total = response.data.data.statuses;
                //console.log("**init tweets**", response.data.data.statuses)

                $scope.itemsPerPage = 10;
                $scope.currentPage = 0;
                $scope.total = $scope.all_tweets_total.length;

                $scope.all_tweets_total.forEach(element => {
                    // DATE
                    $scope.temp = element.created_at.substring(4).split(' ')
                    element.tweet_date = $scope.temp[0] + " " + $scope.temp[1].replace('0','') + ", " + $scope.temp[4]
                    //URL
                    element.tweet_url = "https://twitter.com/i/web/status/" + element.id_str
                });

                $scope.all_tweets =  $scope.offset($scope.currentPage*$scope.itemsPerPage, $scope.itemsPerPage);
                //console.log("all_tweets",$scope.all_tweets.length )

            },function errorCallback(response) {
                console.log("**error**","$scope.all_tweets_total",$scope.all_tweets_total)
            });

    }

    /********* TAB *********/
    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };


    /********* TWEETS *********/
    $scope.offset = function(offset, limit) {
        return  $scope.all_tweets_total.slice(offset, offset+limit);
    }

    $scope.loadMore = function() {
        $scope.currentPage++;
        var newItems = $scope.offset($scope.currentPage*$scope.itemsPerPage,
            $scope.itemsPerPage);
        $scope.all_tweets = $scope.all_tweets.concat(newItems);
    };

    $scope.nextPageDisabledClass = function() {
        if ($scope.currentPage === $scope.pageCount()-1){
            $scope.disabled = {
                'background-color': '#9B9B9B',
                "color" : "white",
                'border':'none'
            }
        }
        return $scope.currentPage === $scope.pageCount()-1 ? "disabled" : "";
    };

    $scope.pageCount = function() {
        return Math.ceil($scope.total/$scope.itemsPerPage);
    };

    /********* COMMENTS *********/
    $scope.offset_comments = function(offset, limit) {
        return  $scope.all_comments_total.slice(offset, offset+limit);
    }

    $scope.loadMore_comments = function() {
        $scope.currentPage_comments++;
        var newItems = $scope.offset_comments($scope.currentPage_comments*$scope.itemsPerPage_comments,
            $scope.itemsPerPage_comments);
        $scope.all_comments = $scope.all_comments.concat(newItems);
    };

    $scope.nextPageDisabledClass_comments = function() {
        if ($scope.currentPage_comments === $scope.pageCount_comments()-1){
            $scope.disabled_comments = {
                'background-color': '#9B9B9B',
                "color" : "white",
                'border':'none'
            }
        }
        return $scope.currentPage_comments === $scope.pageCount_comments()-1 ? "disabled" : "";
    };

    $scope.pageCount_comments = function() {
        return Math.ceil($scope.total_comments/$scope.itemsPerPage_comments);
    };

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
        $scope.socket.emit("typing", $scope.symbol);
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

    $scope.socket.on("on_primary_key", (data) => {
        for (let index = $scope.all_comments_total.length - 1; index > -1; index--) {
            if (data.user_id == $scope.all_comments_total[index].user_id) {
                $scope.all_comments_total[index]["primary_key"] = data.primary_key;
            }
        }
    });
});

var dvSocial = document.getElementById('dvSocial');

angular.element(document).ready(function() {

    angular.bootstrap(dvSocial, ['stockApp']);
});


