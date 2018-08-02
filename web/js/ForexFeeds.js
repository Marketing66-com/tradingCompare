
// (function(window) {
var ThirdApp = angular.module('ThirdApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})


    // var demo = angular.module('LiveFeedsApp', []).config(function ($interpolateProvider) {
    //     $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    // });

    ThirdApp.controller("ThirdController", function ($scope, $http) {
        $scope.desc3 = "Third app. ";

        $scope.all = []
        $scope.all1 = []
        $scope.allimg = {}
        $scope.allimg1 = []
        $scope.alllikes = {}
        $scope.element={}

        var i = 0
        $scope.init = function (api,chart_link,likes) {
            console.log("api", api, "chart_link",chart_link)
            $.ajax({
                url: api,
                type: "GET",
                success: function (result) {

                    $scope.all1 = result

                    for (key in $scope.all1) {
                        if (i < 51) {
                            $scope.all1[key].fromSymbol = $scope.all1[key].fromSymbol.slice(0, 3) + "/" + $scope.all1[key].fromSymbol.slice(3, 6)

                            $scope.all.push($scope.all1[key])
                            i++
                        }
                        else break;
                    }
                    console.log("Response-forex", $scope.all)

                    $scope.$apply()
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("ERROR", thrownError, xhr, ajaxOptions)
                }
            });

// var allimg={}

            // console.log("img", img)
            // $.ajax({
            //     url: img,
            //     type: "GET",
            //     success: function (result) {
            //         $scope.allimg1 = result
            //         for (var i = 0; i < $scope.allimg1.length; i++) {
            //             $scope.allimg[$scope.allimg1[i].name.slice(0, 3) + "/" + $scope.allimg1[i].name.slice(3, 6)] = {img: $scope.allimg1[i].img}
            //
            //         }
            //         // for (const key in myobj) {
            //         //     if (myobj.hasOwnProperty(key)) {
            //         //         const element = myobj[key];
            //         //         $scope.allimg.push(element)
            //         //     }}
            //         //  console.log("Response------", myobj)
            //
            //
            //         console.log("Response**forex*", $scope.allimg)
            //         $scope.$apply()
            //     },
            //     error: function (xhr, ajaxOptions, thrownError) {
            //         console.log("ERROR", thrownError, xhr, ajaxOptions)
            //     }
            // });

            ////////////////////////////////////////////////////////////////////
            console.log("likes",likes)
            $.ajax({
                url: likes,
                type: "GET",
                success: function (result) {
                    $scope.alllikes = result
                    for (const key in $scope.alllikes) {
                        var name =$scope.alllikes[key].name.slice(0, 3) + "/" + $scope.alllikes[key].name.slice(3, 6)
                        $scope.element[name]= $scope.alllikes[key]
                        var sent=($scope.element[name].likes/($scope.element[name].likes+$scope.element[name].unlikes))*100
                        // console.log("Response*likes*", sent)
                        $scope.element[name].sentiment=Number(sent.toFixed(1))

                    }

                    $scope.allimg=$scope.element
                    console.log("Response*likes*Forex", $scope.allimg)

                     $scope.$apply()


                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("ERROR", thrownError, xhr, ajaxOptions)
                }
            });

        }

//
//
        var socket = io.connect("https://forex-websocket.herokuapp.com/", {
            path: "/socket/forex/livefeed"
        })
        socket.on('connect', function () {
            socket.emit('room', "all_pairs");
            socket.on('message', response => {
                var item73

                for (key in response) {
                item73 = $scope.all.find(function (element) {

                    return element.fromSymbol == (response[key].fromSymbol.slice(0, 3) + "/" + response[key].fromSymbol.slice(3, 6));
                });


                if (typeof item73 != typeof undefined) {
                    // console.log("---",item73)
                    for (const property in response[key]) {


                        if (response[key].hasOwnProperty(property) && property != "fromSymbol") {
                            item73[property] = response[key][property];
                            // console.log(item73[key])


                        }
                    }
                    // console.log("+++",item73)
                }

//$scope.all = []

            }
            $scope.$apply()

        })
        })

        $scope.ActiveChange = function (symbol) {

            var from = symbol.slice(0, 3)
            var to = symbol.slice(3, 6)

            console.log(from, to, '*********************')
             var url =  Routing.generate('forex_chart',{"currency" :symbol})
            console.log(Routing.generate('forex_chart',{"currency" :symbol}))
            window.location.href= url
          //  console.log("----", Routing.generate('crypto_chart', from, to, true))
           return url
            // console.log("----",Routing.generate('crypto_chart'))

        }

    });

    var dvThird = document.getElementById('dvThird');

    angular.element(document).ready(function() {

        angular.bootstrap(dvThird, ['ThirdApp']);
    });
//
// })(window);

//     var socket = io.connect("https://xosignals.herokuapp.com/", {
//         path: "/socket/xosignals/livefeed"
//     })
//     socket.on("onUpdate", function (response) {
//     console.log(response)
//         // var item73 = $scope.all.find(function (element) {
//         //     return element.name == response.symbol;
//         // });
//         //
//         // console.log(item73)
//         // if (typeof item73 != typeof undefined) {
//         //     for (const key in response.data) {
//         //         if (response.data.hasOwnProperty(key)) {
//         //             item73[key] = response.data[key];
//         //             $scope.$apply()
//         //         }
//         //     }
//         // }
//
//     });
// })
/*
FORMAT
data
:
ask
:
1.17818
bid
:
1.17818
high
:
1.18207
low
:
1.17783
price
:
1.17818
__proto__
:
Object
symbol
:
"EURUSD"
*/


//     } )
//
//
//
//
//
//
//
//
// });

// demo.service('WebSocketWrapper', ['$log', '$websocket', '$rootScope', function($log, $websocket, $rootScope) {
//     var ws = null;
//
//     this.state = 'initializing';
//     this.message = 'Websocket initializing';
//
//     var self = this;
//
//     this.init = function(){
//         if (!ws) {
//             ws = $websocket('https://xosignals.herokuapp.com/', null, {reconnectIfNotNormalClose: true});
//
//             ws.onOpen(function(){
//                 console.log('connected');
//                 $rootScope.$apply(function () {
//                     self.state = 'connected';
//                     self.message = 'Websocket connected';
//                 });
//             });
//
//             ws.onClose(function(){
//                 console.log('close');
//                 $rootScope.$apply(function () {
//                     self.state = 'disconnected';
//                     self.message = 'Websocket disconnected';
//                 });
//             });
//         }
//     };
//
// }]);
//
//
// demo.controller('WebsocketStateCtrl', ['$scope', 'WebSocketWrapper', function($scope, WebSocketWrapper){
//     $scope.websocket = WebSocketWrapper;
//     $scope.websocket.init();
// }]);
