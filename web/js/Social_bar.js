var SocialApp = angular.module('myApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

SocialApp.controller("SocialController", function ($scope) {
    console.log("hello")

    $scope.firstName = "John";
    $scope.lastName = "Doe";

    $scope.init = function () {
        console.log("init")

    }

});




