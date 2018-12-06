const app = angular.module('app', []);
//   .config(function ($interpolateProvider) {
//   $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
// });

//app.value('firebaseObject', firebase);

app.controller('AppCtrl', function ($scope, $http, $location) {
  $scope.firebase = firebase;

  $scope.data = {};

  this.$onInit = function () {
    console.log('INIT');

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        user.getIdToken(/* forceRefresh */ true).then(function (idToken) {
          console.log('TOKEN', idToken);
          const url = `${$location.protocol()}://${$location.host()}:${$location.port()}/api/secured`;
          console.log('URL', url);
          $http.defaults.headers.common.Authorization = `Bearer ${idToken}`;
          $http.get(url).then(function (response) {
            $scope.data = response.data;
            $scope.apply();
          });
        }).catch(function (error) {
          console.log('ERROR');
          $scope.data = error;
          $scope.apply();
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
