var firstApp = angular.module('firstApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

firstApp.controller('FirstController', function($scope) {
    $scope.desc1 = "First app. ";

    $scope.allcrypto = []
    $scope.allforex = []
    $scope.allstock = []
    $scope.allstock2 = []

    $scope.init = function(api_forex, api_crypto, api_stock, first, second, third ,fourth, forex_from1, forex_to1, forex_from2, forex_to2, stock1,stock2) {

        $.ajax({
            url: "https://crypto-ws.herokuapp.com/All-Froms-and-Prices/" + first +"_USD",
            type: "GET",
            success: function (result) {
                console.log("result", result)
                $scope.crypto3 = result
                // for (i = 0; i < result.length; i++) {
                //     if (result[i].fromSymbol == first) { $scope.crypto3 = result[i]}
                //     if (result[i].fromSymbol == second) {$scope.crypto4 = result[i]}
                // }
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        $.ajax({
            url: "https://crypto-ws.herokuapp.com/All-Froms-and-Prices/" + second +"_USD",
            type: "GET",
            success: function (result) {
                $scope.crypto4 = result
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $.ajax({
            url: api_forex,
            type: "GET",

            success: function (result) {
                console.log("Response-forex", result)
                for (var key in result) {$scope.allforex.push(result[key])}
                for (key in $scope.allforex) {
                    if($scope.allforex[key].fromSymbol == "EURUSD") { $scope.crypto1 = $scope.allforex[key]}
                    if($scope.allforex[key].fromSymbol == "USDJPY") {$scope.crypto2 = $scope.allforex[key]}
                }
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

    ///////////////////////////////////////////////////////////////////////////////////////////
        $.ajax({
            url: api_stock,
            type: "GET",
            success: function (result) {
                $scope.allstock = result
                for (key in $scope.allstock) {
                    if (key == "FB" || key == "AAPL") {
                        $scope.allstock2.push($scope.allstock[key])
                    }
                }
                for (key in result)
                {
                    if(key == stock1) {$scope.crypto5 = result[key];}
                    if(key == stock2) { $scope.crypto6 = result[key];}
                }

                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });



        ///////////////////////////////////////////////////////////////////////////////////////
        var socket1 = io.connect("https://crypto-ws.herokuapp.com", {'force new connection': true});
        socket1.on('connect', function () {

            socket1.emit('room', ["BTC_USD_1sec","ETH_USD_1sec"]);
            // socket1.emit('room', ["BTC_USD_2secWeb","ETH_USD_2secWeb"]);
            socket1.on('message', data =>{
                //console.log("data bar", data)
                if(data.pair == $scope.crypto3.pair )
                {
                    $scope.crypto3 = data;
                    $scope.crypto3.fromSymbol = first
                    $scope.crypto3.toSymbol = "USD"
                }
                if(data.pair == $scope.crypto4.pair )
                {
                    $scope.crypto4 = data;
                    $scope.crypto4.fromSymbol = second
                    $scope.crypto4.toSymbol = "USD"
                }

                // if(data.s == $scope.crypto3.pair )
                // {
                //     $scope.crypto3.price = data.p;
                //     $scope.crypto3.change24 = data.c;
                //     $scope.crypto3.point = data.pt;
                //     $scope.crypto3.fromSymbol = first
                //     $scope.crypto3.toSymbol = "USD"
                // }
                // if(data.s == $scope.crypto4.pair )
                // {
                //     $scope.crypto4.price = data.p;
                //     $scope.crypto4.change24 = data.c;
                //     $scope.crypto4.point = data.pt;
                //     $scope.crypto4.fromSymbol = second
                //     $scope.crypto4.toSymbol = "USD"
                // }

                    // var item73 = $scope.allcrypto.find(function (element) {
                    //     console.log("data allcrypto", $scope.allcrypto )
                    //     return (element.pair == data.pair);
                    //     //return (element.fromSymbol == key.split("_",1) && element.toSymbol == key.split("_")[1]);
                    // })

                //
                //     if (typeof item73 != typeof undefined) {
                //
                //         for (const key in data) {
                //             if (data.hasOwnProperty(key)) {
                //                 item73[key] = data[key];
                //             }
                //         }
                //     }
                $scope.$apply()

            })
        })
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
        var socket2 = io.connect("https://forex-websocket.herokuapp.com/", {
            path: "/socket/forex/livefeed"}, {'force new connection': true})
        socket2.on('connect', function() {

            socket2.emit('room', ["EURUSD_1sec","USDJPY_1sec"]);
            socket2.on("message", function (response) {


                var item73 = $scope.allforex.find(function (element) {

                    //console.log("element.name", element.name, "response.fromSymbol", response.fromSymbol)
                    // if(response.fromSymbol == "EURUSD" || response.fromSymbol == "USDJPY" )
                    // {
                        // console.log("response24",response.data.change24)
                        return element.pair == response.pair;
                    // }
                    // if(element.name == response.fromSymbol)
                    // {console.log("response",response)}

                    //console.log("element.name", element.name, "response.fromSymbol", response.fromSymbol)
                });

                if (typeof item73 != typeof undefined) {
                    for (const key in response) {
                        if (response.hasOwnProperty(key)) {
                            item73[key] = response[key];
                            $scope.$apply()
                        }
                    }
                }

            })
            $scope.$apply()
        })
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////


        var socket = io.connect("https://websocket-stock.herokuapp.com")
        console.log("ALLSTOCK",$scope.allstock)
        socket.on('connect', function () {
            socket.emit('room', "persec");
            socket.on('message', data => {
               // console.log("STOCK RESP", data)
            for (const key in data) {
                var item73 = $scope.allstock2.find(function (element) {

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

    }
});


var dvFirst = document.getElementById('dvFirst');

angular.element(document).ready(function() {

    angular.bootstrap(dvFirst, ['firstApp']);

});

