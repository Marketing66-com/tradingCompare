var ChartApp = angular.module('chartApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

ChartApp.controller('ChartController', function($scope) {

    $scope.from ;
    $scope.to ;
    $scope.sentiment;
    $scope.name;
    $scope.img;

    $scope.init = function (currency, from, to, crypto_api, crypto_likes) {
        $scope.from = from
        $scope.to = to

        $.ajax({
            url: crypto_api + "/" + from + "_" + to,
            type: "GET",
            success: function (result) {
                // console.log("result", result)
                $scope.mycrypto = result[from + "_" + to]
                console.log("after",  $scope.mycrypto.name)

                if($scope.mycrypto.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"|| $scope.mycrypto.img == undefined || typeof $scope.mycrypto.img== "undefined")
                    $scope.mycrypto.img = "/img/crypto_logos/crypto-other.png"

                var sent=($scope.mycrypto.likes / ($scope.mycrypto.likes + $scope.mycrypto.unlikes)) *100
                $scope.mycrypto.sentiment = Number(sent.toFixed(1))

                $scope.sentiment = Number(sent.toFixed(1))
                $scope.name = $scope.mycrypto.name
                $scope.img = $scope.mycrypto.img

                console.log("after",  $scope.mycrypto)
                console.log("after",  $scope.mycrypto.name)
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

        socket.emit('room', room);
        socket.on('message', data => {
           //console.log("data*********************************", data)
            $scope.mycrypto = data
            $scope.mycrypto.name = $scope.name
            $scope.mycrypto.img =  $scope.img
            $scope.mycrypto.sentiment = $scope.sentiment

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