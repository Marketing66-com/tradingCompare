const LogButton = angular.module('LogButton', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

LogButton.controller('LogButton', function ($scope, MemberService) {
    $scope.firebase = firebase;
    $scope.userLoggedIn = false;
    $scope.data = {};
    $scope.user = {};

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
                        $scope.$apply();
                       // console.log("user",$scope.user )
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
            }
        });
    };
    $scope.behaviour = function() { console.log("in behaviour")}
    $scope.logout = function(){
        console.log("in out")
        $scope.userLoggedIn = false;
        firebase.auth().signOut();
    }
});

const dvLogButton = document.getElementById('dvLogButton');

angular.element(document).ready(function () {

    angular.bootstrap(dvLogButton, ['LogButton']);

});
