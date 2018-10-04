var ChartApp = angular.module('chartApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

ChartApp.controller('ChartController', function($scope) {

    $scope.allcrypto = []
    $scope.alllikes = {}
    $scope.element={}
    $scope.from ;
    $scope.to ;

    $scope.init = function (currency, from, to, crypto_api, crypto_likes) {
        $scope.from = from
        $scope.to = to

        $.ajax({
            url: crypto_api + "/" + from + "_" + to,
            type: "GET",
            success: function (result) {
                //console.log("result", result)
                $scope.mycrypto = result
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        $.ajax({
            url: crypto_likes,
            type: "GET",
            success: function (result) {
                $scope.alllikes = result
                for (const key in $scope.alllikes) {
                    $scope.element[$scope.alllikes[key].symbol]= $scope.alllikes[key]
                    var sent=($scope.element[$scope.alllikes[key].symbol].likes/($scope.element[$scope.alllikes[key].symbol].likes+$scope.element[$scope.alllikes[key].symbol].unlikes))*100
                    // console.log("Response*likes*", sent)
                    $scope.element[$scope.alllikes[key].symbol].sentiment=Number(sent.toFixed(1))
                }
                for (const key in $scope.element) {

                    if ($scope.element[key].symbol == from && $scope.element[key].toSymbol == to) {
                        $scope.allimg = $scope.element[key]
                    }
                }
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });
    }

/////////////////////////////////////////////////////////////////////////////////////////////////

    var socket = io.connect("https://crypto.tradingcompare.com/")
    socket.on('connect', function () {
        var room =  $scope.from +"_"+ $scope.to
        //console.log("$scope.to",$scope.to)
        socket.emit('room', room);
        socket.on('message', data => {
           //console.log("data*********************************", data)
            $scope.mycrypto = data
            $scope.mycrypto.Maketcap =  data.marketcap
            $scope.mycrypto.fromSymbol = $scope.from
            $scope.mycrypto.toSymbol = $scope.to
            $scope.$apply()
    })
    })

    $scope.getDisplayValue = function(currentValue)
    {
        return intFormat(currentValue);
    }
});

var dvChart = document.getElementById('dvChart');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart, ['chartApp']);
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// var socket = io.connect("https://crypto-ws.herokuapp.com")
//
// socket.on('connect', function () {
//     socket.emit('room', "all_regulated");
//     socket.on('message', data => {
//     for (const key in data) {
//     var item73 = $scope.allcrypto.find(function (element) {
//
//         return ((element.fromSymbol == key.split("_",1))&&(element.toSymbol == key.split("_")[1]));
//
//     })
//     // console.log("item73", item73)
//     if (typeof item73 != typeof undefined) {
//         for (const ky in data[key]) {
//             if (data.hasOwnProperty(key)) {
//                 item73[ky] = data[key][ky];
//             }
//         }
//     }
//     $scope.$apply()
// }
//