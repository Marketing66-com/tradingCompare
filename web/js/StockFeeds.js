
// (function(window) {
var stockApp = angular.module('stockApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})


// var demo = angular.module('LiveFeedsApp', []).config(function ($interpolateProvider) {
//     $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
// });

stockApp.controller("stockController", function ($scope, $http) {

    $scope.all = []
    $scope.all_stocks = []
    $scope.allimg = {}
    $scope.allimg1 = []
    $scope.alllikes = {}
    $scope.element={}

    var i = 0
    $scope.init = function (stocks_api, chart_link, stocks_likes) {
        console.log("api", stocks_api, chart_link, stocks_likes)

        // currencie
        $.ajax({
            url: stocks_api,
            type: "GET",
            success: function (result) {

                $scope.all_stocks = result
                console.log("all_stocks",$scope.all_stocks)
                for (key in $scope.all_stocks) {
                    if (i < 50) {
                        $scope.all.push($scope.all_stocks[key])
                        i++
                    }
                    else break;
                }
                $scope.$apply()
            },

            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        // likes
        $.ajax({
            url: stocks_likes,
            type: "GET",
            success: function (result) {
                $scope.alllikes = result
                for (const key in $scope.alllikes) {
                    $scope.element[$scope.alllikes[key].symbol] = $scope.alllikes[key]
                    var sent = ($scope.element[$scope.alllikes[key].symbol].likes / ($scope.element[$scope.alllikes[key].symbol].likes + $scope.element[$scope.alllikes[key].symbol].unlikes)) * 100
                    // console.log("Response*likes*", sent)
                    $scope.element[$scope.alllikes[key].symbol].sentiment = Number(sent.toFixed(1))
                }
                $scope.allimg = $scope.element
                //console.log("Response*likes*", $scope.allimg)
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        })
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var socket = io.connect("https://websocket-stock.herokuapp.com")

        socket.on('connect', function () {
        socket.emit('room', "persec");
        socket.on('message', data => {
            //console.log("STOCK RESP", data)
            for (const key in data) {
                var item73 = $scope.all.find(function (element) {
                    return (element.name == data[key].name);
                })
                if (typeof item73 != typeof undefined) {
                    for (const ky in data[key]) {
                        if (data.hasOwnProperty(key)) {
                            item73[ky] = data[key][ky];
                        }
                    }
                }
                $scope.$apply()
            }
        })
    })


    $scope.ActiveChange = function (symbol) {

        var url =  Routing.generate('stock_chart',{"currency" :symbol})
        console.log(Routing.generate('stock_chart',{"currency" :symbol}))
        window.location.href= url
        //  console.log("----", Routing.generate('crypto_chart', from, to, true))
        return url
        // console.log("----",Routing.generate('crypto_chart'))

    }

});

var dvstock = document.getElementById('dvstock');

angular.element(document).ready(function() {

    angular.bootstrap(dvstock, ['stockApp']);
});
//
// })(window);


