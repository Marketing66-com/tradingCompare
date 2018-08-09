var ChartLiveApp = angular.module('chartLiveApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})


ChartLiveApp.controller('ChartLiveController', function($scope) {

    $scope.init = function (api, from, to, likes) {
        console.log("api**************////////////**************", api)


    }
});

var dvChartlive = document.getElementById('dvChart-live');

angular.element(document).ready(function() {

    angular.bootstrap(dvChartlive, ['chartLiveApp']);
});