const app = angular.module('app', ['memberService']);

app.controller('AppCtrl', function ($scope, MemberService) {
    $scope.firebase = firebase;

    $scope.data = {};

    this.$onInit = function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                user.getIdToken(/* forceRefresh */ true).then(function (idToken) {
                    // MemberService.getSentimentsByUser(idToken).then(function (results) {
                    MemberService.getSampleSecuredPage(idToken).then(function (results) {
                        $scope.data = results;
                        $scope.$apply();
                    }).catch(function (error) {
                        $scope.data = error;
                        $scope.$apply();
                    })
                }).catch(function (error) {
                    console.log('ERROR: ', error)
                });
            } else {
                alert('NOT AUTHENTICATED! Sign In First');
            }
        });

    };
});

const sampleDiv = document.getElementById('sampleDiv');

angular.element(document).ready(function () {

    angular.bootstrap(sampleDiv, ['app']);

});
