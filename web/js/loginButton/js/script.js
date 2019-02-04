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
                //console.log("user",user )
                $scope.userLoggedIn = true;
                $scope.user.full_name = 'Welcome...'

                user.getIdToken(true).then(function (idToken) {
                    //console.log("idToken",idToken )
                    $scope._id = {
                        _id: user.uid
                    }
                    MemberService.getUsersById(idToken,  $scope._id ).then(function (results) {
                        $scope.user = results.data
                        //console.log(" $scope.user",$scope.user )
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

    $scope.profile = function() { console.log("in profile")}

    $scope.logout = function(){
        firebase.auth().signOut();

        if(window.location.pathname.indexOf('Social-Sentiment')>-1 || window.location.pathname.indexOf('Leaderboard')>-1){
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