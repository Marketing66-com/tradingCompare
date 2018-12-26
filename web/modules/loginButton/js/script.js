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
    }
});

const dvLogButton = document.getElementById('dvLogButton');

angular.element(document).ready(function () {

    angular.bootstrap(dvLogButton, ['LogButton']);

});
