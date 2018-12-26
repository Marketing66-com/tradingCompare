var firstApp = angular.module('firstApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

firstApp.controller('FirstController', function($scope,$window,$http) {
    $scope.desc1 = "First app. ";

    $scope.allforex = []
    $scope.barstock = []
    $scope.allstock2 = []
    $scope.last_price = {}
    $scope.bar_object ={}

    $scope.stock1
    $scope.stock2

    $scope.cryptoname1
    $scope.cryptoname2

    $scope.init = function(api_forex, api_crypto, api_stock, crypto_from1, crypto_from2, crypto_to1 ,crypto_to2,
                           forex_from1, forex_to1, forex_from2, forex_to2, stock1,stock2) {

        $scope.stock1 = stock1
        $scope.stock2 = stock2

        $.ajax({
            url: api_crypto + "/" + crypto_from1 + "_" + crypto_to1 + "," + crypto_from2 + "_" + crypto_to2,
            type: "GET",
            success: function (result) {
                //console.log("barcrypto", result)
                $scope.crypto3 = result[crypto_from1 + "_" + crypto_to1]
                $scope.crypto4 = result[crypto_from2 + "_" + crypto_to2]
                $scope.cryptoname1 = $scope.crypto3.name
                $scope.cryptoname2 = $scope.crypto4.name

                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $.ajax({
            url: "https://forex.tradingcompare.com/all_data/"+ forex_from1 + forex_to1 + "," + forex_from2 + forex_to2,
            type: "GET",

            success: function (result) {
                //console.log("Response-forex api", result)
                $scope.crypto1 = result[forex_from1 + forex_to1]
                $scope.crypto2 = result[forex_from2 + forex_to2]
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        ///////////////////////////////////////////////////////////////////////////////////////////
        $.ajax({
            url: "https://websocket-stock.herokuapp.com/Getstocks/" + stock1 + "," + stock2,
            type: "GET",
            success: function (result) {
                $scope.barstock = result
                //console.log("$scope.barstock", $scope.barstock)
                $scope.crypto5 = $scope.barstock[stock1]
                $scope.crypto6 = $scope.barstock[stock2]

                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
                $http.get("https://interactivecrypto.herokuapp.com/getLastRecord/" + stock1)
                    .then(function(response) {
                        console.log("took in db",stock1)
                        $scope.crypto5 = response
                    });
                $http.get("https://interactivecrypto.herokuapp.com/getLastRecord/" + stock2)
                    .then(function(response) {
                        console.log("took in db",stock2)
                        $scope.crypto6 = response
                    });
            }
        });

/////****************************SOCKETS*********************************/////
        //CRYPTO
        var socket1 = io.connect("https://crypto.tradingcompare.com/")
        socket1.on('connect', function () {
            var crypto1 = crypto_from1 + "_" + crypto_to1
            var crypto2 = crypto_from2 + "_" + crypto_to2

            socket1.emit('room', [crypto1, crypto2]);
            socket1.on('message', data => {
                //console.log("data socket", data.pair,data.variation)
                if (data.hasOwnProperty('pair')) {
                    if (data.pair == $scope.crypto3.pair) {
                        $scope.crypto3 = data;
                        $scope.crypto3.fromSymbol = crypto_from1
                        $scope.crypto3.toSymbol = "USD"
                        $scope.crypto3.name = $scope.cryptoname1

                    }

                    if (data.pair == $scope.crypto4.pair) {
                        $scope.crypto4 = data;
                        $scope.crypto4.fromSymbol = crypto_from2
                        $scope.crypto4.toSymbol = "USD"
                        $scope.crypto4.name = $scope.cryptoname2
                    }
                }
                else {
                    console.log("data bar else", data)
                }
                $scope.$apply()
            })
        })

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //FOREX
        var socket2 =  io.connect('https://forex.tradingcompare.com', {'force new connection': true});
        socket2.on('connect', function () {

            // socket2.emit('room', ["EURUSD", "USDJPY"]);
            socket2.emit('room', "EURUSD");
            socket2.on("message", function (response) {
                //console.log("response forex",response)
                if(response.pair == forex_from1 + forex_to1) {
                    $scope.crypto1 = response
                }
                if(response.pair == forex_from2 + forex_to2) {
                    $scope.crypto2 = response
                }
            })
            $scope.$apply()
        })
        // var socket2 = io.connect("https://forex-websocket.herokuapp.com/", {
        //     path: "/socket/forex/livefeed"
        // }, {'force new connection': true})
        // socket2.on('connect', function () {
        //
        //     socket2.emit('room', ["EURUSD_1sec", "USDJPY_1sec"]);
        //     socket2.on("message", function (response) {
        //         //console.log("response forex",response)
        //
        //         var item73 = $scope.allforex.find(function (element) {
        //             return element.pair == response.pair;
        //         });
        //
        //         if (typeof item73 != typeof undefined) {
        //             for (const key in response) {
        //                 if (response.hasOwnProperty(key)) {
        //                     item73[key] = response[key];
        //                     $scope.$apply()
        //                 }
        //             }
        //         }
        //
        //     })
        //     $scope.$apply()
        // })
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        //STOCK
        var socketStock = io.connect("https://ws-api.iextrading.com/1.0/last");
        var str = stock1 + "," + stock2
        //console.log("str",str)
        socketStock.emit("subscribe", str);

        socketStock.on("message", (data) => {
            data = JSON.parse(data);
            //console.log("data", data,)
            $scope.bar_object[data.symbol] = data.price
            $scope.$apply()
        })


        setInterval(function () {
            //console.log("in interval bar",)
            for (key in $scope.bar_object) {

                if (key == stock1 && ($scope.crypto5 == undefined && typeof $scope.crypto5 == "undefined")) {
                    //console.log("1")
                    $scope.crypto5 = {}
                    $scope.crypto5.pair = stock1
                    $scope.crypto5.name = "Facebook"
                    $scope.crypto5.price = $scope.bar_object[key]
                    $scope.barstock[key] = {}
                    $scope.barstock[key].open24 = $scope.bar_object[key]
                    $scope.crypto5.change24 = 0
                    $scope.crypto5.point = 0
                    $scope.last_price[key] = $scope.bar_object[key]

                }
                else if (key == stock2 && ($scope.crypto6 == undefined && typeof $scope.crypto6 == "undefined")) {
                    //console.log("2")
                    $scope.crypto6 = {}
                    $scope.crypto6.pair = stock2
                    $scope.crypto6.name = "Apple"
                    $scope.crypto6.price = $scope.bar_object[key]
                    $scope.barstock[key] = {}
                    $scope.barstock[key].open24 = $scope.bar_object[key]
                    $scope.crypto6.change24 = 0
                    $scope.crypto6.point = 0
                    $scope.last_price[key] = $scope.bar_object[key]
                }
                else {
                    if (key == stock1) {
                        //console.log("3")
                        $scope.crypto5.price = $scope.bar_object[key]

                        if ($scope.last_price.hasOwnProperty((key))) {
                            if ($scope.bar_object[key] > $scope.last_price[key]) $scope.crypto5.variation = "up"
                            else if ($scope.bar_object[key] < $scope.last_price[key]) $scope.crypto5.variation = "down"
                        }
                        else $scope.crypto5.variation = "none"

                        $scope.crypto5.change24 = ((($scope.bar_object[key] - $scope.barstock[key].open24) / $scope.barstock[key].open24) * 100).toFixed(2)
                        $scope.crypto5.point = ($scope.barstock[key].open24 - $scope.bar_object[key]).toFixed(2)

                        $scope.last_price[key] = $scope.bar_object[key]
                    }
                    if (key == stock2) {
                        //console.log("4")
                        $scope.crypto6.price = $scope.bar_object[key]

                        if ($scope.last_price.hasOwnProperty((key))) {
                            if ($scope.bar_object[key] > $scope.last_price[key]) $scope.crypto6.variation = "up"
                            else if ($scope.bar_object[key] < $scope.last_price[key]) $scope.crypto6.variation = "down"
                        }
                        else $scope.crypto6.variation = "none"

                        $scope.crypto6.change24 = ((($scope.bar_object[key] - $scope.barstock[key].open24) / $scope.barstock[key].open24) * 100).toFixed(2)
                        $scope.crypto6.point = ($scope.barstock[key].open24 - $scope.bar_object[key]).toFixed(2)

                        $scope.last_price[key] = $scope.bar_object[key]
                    }
                    //console.log("$scope.crypto6", $scope.crypto6)
                }
                $scope.$apply()
            }
        }, 5000);
        // })

    }

/////**************************** CLICKS FUNCTIONS *********************************/////

    // CRYPTO
    $scope.GotoCrypto = function (symbol, name, _locale) {
        //console.log("symbol666", symbol, name)

        if(name.indexOf(' ') > -1)
            name = name.replace(/ /g, '-')

        var url =  Routing.generate('crypto_chart',{"currency" :symbol, "name" :name, "_locale": _locale})
        //console.log(Routing.generate('crypto_chart',{"currency" :symbol, "name" :name}))
        $window.location= url
        return url

    }
    // FOREX
    $scope.GotoStock = function (symbol, name, _locale) {

        if(name.indexOf(' ') > -1)
            name = name.replace(/ /g, '-')

        var url =  Routing.generate('stock_chart',{"symbol" :symbol, "name":name , "_locale": _locale})
        //console.log(Routing.generate('stock_chart',{"symbol" :symbol, "name":name }))
        $window.location= url
        return url
    }
    //STOCK
    $scope.GotoForex = function (symbol, _locale) {

        var from = symbol.slice(0, 3)
        var to = symbol.slice(3, 6)
        symbol = from + "-" + to

        var url =  Routing.generate('forex_chart',{"currency" :symbol, "_locale": _locale})
        //console.log(Routing.generate('forex_chart',{"currency" :symbol}))
        $window.location= url

    }
});


var dvFirst = document.getElementById('dvFirst');

angular.element(document).ready(function() {

    angular.bootstrap(dvFirst, ['firstApp']);

});

