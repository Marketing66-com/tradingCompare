var ProfileApp = angular.module('ProfileApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

ProfileApp.controller('ProfileController', function($scope) {
    $scope.tab = 5;

    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };

});

var dvProfile = document.getElementById('dvProfile');
angular.element(document).ready(function() {
    angular.bootstrap(dvProfile, ['ProfileApp']);
});

