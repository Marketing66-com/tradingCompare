var firstApp = angular.module('firstApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

firstApp.controller('FirstController', function($scope) {
    $scope.desc1 = "First app. ";
    //$scope.api = "https://crypto-ws.herokuapp.com/All-Froms-and-Prices"
    //$scope.first = "BTC"
    $scope.allcrypto = []
    $scope.allforex = []
    $scope.allstock = []

    $scope.init = function(api_forex, api_crypto, api_stock, first, second, third ,fourth, forex_from1, forex_to1, forex_from2, forex_to2, stock1,stock2) {
        //console.log("api_crypto", first, second,third,fourth, forex_from1, forex_to1, forex_from2, forex_to2)
        console.log("hello",api_stock,first, second, third ,fourth, forex_from1, forex_to1, forex_from2, forex_to2,stock1,stock2)
        $.ajax({
            url: api_crypto,
            type: "GET",
            success: function (result) {
                $scope.allcrypto = result
                //console.log("Response1",  $scope.allcrypto)
                for (i = 0; i < result.length; i++) {
                    // if(result[i].fromSymbol == first) {$scope.crypto1 = result[i]}
                    // if(result[i].fromSymbol == second) { $scope.crypto2 = result[i]}
                    if (result[i].fromSymbol == first) {
                        $scope.crypto3 = result[i]
                    }
                    if (result[i].fromSymbol == second) {
                        $scope.crypto4 = result[i]
                    }

                }

                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //console.log("api_forex", api_forex);
        $.ajax({
            url: api_forex,
            type: "GET",

            success: function (result) {
                //console.log("Response-forex", result)
                for (var key in result) {
                    $scope.allforex.push(result[key])
                }
                //console.log("typeof $scope.allforex",typeof $scope.allforex,$scope.allforex)

                // $scope.allforex = result
//             console.log("forex_from2", forex_from2, "forex_to2", forex_to2)
            for (key in $scope.allforex) {
                    // if(result[i].fromSymbol == forex_from1 && result[i].toSymbol == forex_to1) {$scope.crypto1 = result[i]}
            if($scope.allforex[key].fromSymbol == "EURUSD")
            { $scope.crypto1 = $scope.allforex[key]}

            if($scope.allforex[key].fromSymbol == "USDJPY")
            { $scope.crypto2 = $scope.allforex[key]}

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
                (console.log("result",result))
                $scope.allstock = result

                for (key in result)
                {
                    if(key == stock1)
                    {console.log("key",key)
                        console.log("result[key]",result[key])
                        $scope.crypto5 = result[key];}

                    if(key == stock2)
                    {console.log("key",key)
                        console.log("result[key]",result[key])
                        $scope.crypto6 = result[key];}

                }

                console.log("$scope.crypto5", $scope.crypto5, "$scope.crypto6", $scope.crypto6)
                //
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        ///////////////////////////////////////////////////////////////////////////////////////
        var socket1 = io.connect("https://crypto-ws.herokuapp.com", {'force new connection': true});
        socket1.on('connect', function () {
            socket1.emit('room', "all_regulated");
            socket1.on('message', data =>{

                for (const key in data) {
                var item73 = $scope.allcrypto.find(function (element) {
                    return (element.fromSymbol == key.split("_",1) && element.toSymbol == key.split("_")[1]);
                })
                // console.log("item73", item73)
                if (typeof item73 != typeof undefined) {
                    for (const ky in data[key]) {
                        if (data.hasOwnProperty(key)) {
                            item73[ky] = data[key][ky];
                        }
                    }
                } $scope.$apply()
            }
        })
        })
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
        var socket2 = io.connect("https://forex-websocket.herokuapp.com/", {
            path: "/socket/forex/livefeed"}, {'force new connection': true})
        socket2.on('connect', function() {

            // socket2.on("onUpdate", function (response) {
            socket2.on("forbar", function (response) {
                //console.log("$scope.allforex",typeof $scope.allforex)
                //console.log("$scope response",typeof $scope.allforex)
                //console.log("forbar", response)
                var item73 = $scope.allforex.find(function (element) {

                    //console.log("element.name", element.name, "response.fromSymbol", response.fromSymbol)
                    // if(response.fromSymbol == "EURUSD" || response.fromSymbol == "USDJPY" )
                    // {
                        // console.log("response24",response.data.change24)
                        return element.pair == response.fromSymbol;
                    // }
                    // if(element.name == response.fromSymbol)
                    // {console.log("response",response)}

                    //console.log("element.name", element.name, "response.fromSymbol", response.fromSymbol)
                });

                if (typeof item73 != typeof undefined) {
                    for (const key in response.data) {
                        if (response.data.hasOwnProperty(key)) {
                            item73[key] = response.data[key];
                            $scope.$apply()
                        }
                    }
                }

            })
            $scope.$apply()
        })
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        var socket = io.connect("https://websocket-stock.herokuapp.com")

        socket.on('connect', function () {
            socket.emit('room', "p");
            socket.on('message', data => {
                console.log("data",data)
                for (const key in data) {
                var item73 = $scope.allstock.find(function (element) {

                    return (element.name == data[i].name);

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
            //
        })
        })

    }
});


var dvFirst = document.getElementById('dvFirst');

angular.element(document).ready(function() {

    angular.bootstrap(dvFirst, ['firstApp']);

});



// var bar_demo = angular.module('LiveBarApp',[]).config(function($interpolateProvider){
//     $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
// });
//
//
//
// bar_demo.controller("BarFeedsController", function($scope,$http) {
//
//     $scope.allcrypto =[]
//     $scope.allforex =[]
//     $scope.init = function(api_forex, api_crypto, first, second, third, fourth, fifth, sixth, forex_from1, forex_to1, forex_from2, forex_to2) {
//         console.log("api_crypto", api_crypto, first, second, third, fourth, fifth, sixth, forex_from1, forex_to1, forex_from2, forex_to2)
//         $.ajax({
//             url: api_crypto,
//             type: "GET",
//             success: function (result) {
//                 $scope.allcrypto = result
//                 console.log("Response1",  $scope.allcrypto)
//                 for (i = 0; i < result.length; i++) {
//                     // if(result[i].fromSymbol == first) {$scope.crypto1 = result[i]}
//                     // if(result[i].fromSymbol == second) { $scope.crypto2 = result[i]}
//                     if (result[i].fromSymbol == first) {
//                         $scope.crypto3 = result[i]
//                     }
//                     if (result[i].fromSymbol == second) {
//                         $scope.crypto4 = result[i]
//                     }
//                     if (result[i].fromSymbol == third) {
//                         $scope.crypto5 = result[i]
//                     }
//                     if (result[i].fromSymbol == fourth) {
//                         $scope.crypto6 = result[i]
//                     }
//                     // if(result[i].fromSymbol == fifth ) { $scope.crypto5 = result[i]}
//                     // if(result[i].fromSymbol == sixth) {  $scope.crypto6 = result[i]}
//
//                 }
//
//                 $scope.$apply()
//             },
//             error: function (xhr, ajaxOptions, thrownError) {
//                 console.log("ERROR", thrownError, xhr, ajaxOptions)
//             }
//         });
//
//
//         $.ajax({
//             url: api_forex,
//             type: "GET",
//             success: function (result) {
//                 $scope.allforex = result
//                 //console.log("Response2", $scope.allforex)
//                 //console.log("forex_from2", forex_from2, "forex_to2", forex_to2)
//                 for (i = 0; i < result.length; i++) {
//                     // if(result[i].fromSymbol == forex_from1 && result[i].toSymbol == forex_to1) {$scope.crypto1 = result[i]}
//                     if (result[i].name == forex_from1 + forex_to1) {
//                         $scope.crypto1 = result[i]
//                     }
//                     if (result[i].name == forex_from2 + forex_to2) {
//                         $scope.crypto2 = result[i]
//                     }
//                     // if(result[i].fromSymbol == third) { $scope.crypto3 = result[i]}
//                     // if(result[i].fromSymbol == fourth) { $scope.crypto4 = result[i]}
//                     // if(result[i].fromSymbol == fifth ) { $scope.crypto5 = result[i]}
//                     // if(result[i].fromSymbol == sixth) {  $scope.crypto6 = result[i]}
//
//                 }
//
//                 $scope.$apply()
//             },
//             error: function (xhr, ajaxOptions, thrownError) {
//                 console.log("ERROR", thrownError, xhr, ajaxOptions)
//             }
//         });
//
//     }
//     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     var socket1 = io.connect("https://crypto-ws.herokuapp.com", {'force new connection': true})
//     socket1.on('connect', function () {
//         socket1.emit('room', "all_regulated");
//         socket1.on('message', data =>{
//
//             for (const key in data) {
//             var item73 = $scope.allcrypto.find(function (element) {
//                 return (element.fromSymbol == key.split("_",1) && element.toSymbol == key.split("_")[1]);
//             })
//             // console.log("item73", item73)
//             if (typeof item73 != typeof undefined) {
//                 for (const ky in data[key]) {
//                     if (data.hasOwnProperty(key)) {
//                         item73[ky] = data[key][ky];
//                     }
//                 }
//             } $scope.$apply()
//         }
//         })
//     })
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     var socket2 = io.connect("https://forex-websocket.herokuapp.com/", {
//         path: "/socket/forex/livefeed"}, {'force new connection': true})
//     socket2.on('connect', function() {
//
//     socket2.on("onUpdate", function (response) {
//         //console.log("$scope.allforex",$scope.allforex)
//
//             var item73 = $scope.allforex.find(function (element) {
//                 //console.log("response", response)
//                 //console.log("element.name", element.name, "response.fromSymbol", response.fromSymbol)
//                 if(response.fromSymbol == "EURUSD" || response.fromSymbol == "USDJPY" )
//                 {
//                     // console.log("response24",response.data.change24)
//                     return element.name == response.fromSymbol;
//                 }
//                 // if(element.name == response.fromSymbol)
//                 // {console.log("response",response)}
//
//                     //console.log("element.name", element.name, "response.fromSymbol", response.fromSymbol)
//
//
//
//             });
//
//             if (typeof item73 != typeof undefined) {
//                 for (const key in response.data) {
//                     if (response.data.hasOwnProperty(key)) {
//                         item73[key] = response.data[key];
//                         $scope.$apply()
//                     }
//                 }
//             }
//
//     })
//     })
//
//
//
//     /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// })
//
// // var dvFirst = document.getElementById('dvFirst');
// //
// //
// //
// // angular.element(document).ready(function() {
// //
// //     angular.bootstrap(dvFirst, ['bar_demo']);
// //
// // });
