var Social_Sentiment_Ctrl = angular.module('Social_Sentiment_Ctrl', ['ui.bootstrap', 'memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

Social_Sentiment_Ctrl.controller("Social_Sentiment_Ctrl", function ($scope,$http) {

    $scope.init = function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $scope.userLoggedIn = true;
            //console.log("getuser",user)
            user.getIdToken(true).then(function (idToken) {
                console.log("getIdToken")
                 $scope.idToken = idToken
                })
                .then(() => {
                })
                .catch(function (error) {
                        $scope.data = error;
                        console.log("$scope.data", $scope.data)
                        $scope.$apply();
                })
            $scope.$apply();
        }
        else{
            $scope.userLoggedIn = false;
            console.log("no user")
            $scope.$apply();
        }
    });

        $http.get("https://websocket-stock.herokuapp.com/stocks/" + country_value)
            .then(function (result) {
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("error", $scope.data)
                $scope.$apply();
            })
    }
})

var dvSocialSentiment = document.getElementById('dvSocialSentiment');

angular.element(document).ready(function() {

    angular.bootstrap(dvSocialSentiment, ['Social_Sentiment_Ctrl']);
});
