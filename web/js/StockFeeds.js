
// (function(window) {
var stockApp = angular.module('stockApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})


// var demo = angular.module('LiveFeedsApp', []).config(function ($interpolateProvider) {
//     $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
// });

stockApp.controller("stockController", function ($scope, $http) {

    $scope.all = []
    $scope.all1 = []
    $scope.allimg = {}
    $scope.allimg1 = []

    var i = 0
    $scope.init = function (api, img,chart_link) {
        console.log("api", api, "chart_link",chart_link)

        $.ajax({
            url: api,
            type: "GET",
            success: function (result) {
                //console.log("result",result)
                $scope.all1 = result

                for (key in $scope.all1) {
                    if (i < 51) {
                        $scope.all1[key].fromSymbol = key
                        $scope.all1[key].pair = key
                        $scope.all1[key].open24 = $scope.all1[key].my_open_24
                        $scope.all1[key].high24 = $scope.all1[key].High
                        $scope.all1[key].low24 = $scope.all1[key].Low
                        $scope.all1[key].change24 = $scope.all1[key].change

                        $scope.all.push($scope.all1[key])
                        i++
                    }
                    else break;
                }
                //console.log("Response-stock", $scope.all)

                $scope.$apply()
            },

            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

// var allimg={}

        console.log("img", img)

        $.ajax({
            url: img,
            type: "GET",
            success: function (result) {
                $scope.allimg1 = result
                for (var i = 0; i < $scope.allimg1.length; i++) {
                    $scope.allimg[$scope.allimg1[i].name] = {img: $scope.allimg1[i].img}

                }
                // for (const key in myobj) {
                //     if (myobj.hasOwnProperty(key)) {
                //         const element = myobj[key];
                //         $scope.allimg.push(element)
                //     }}
                //  console.log("Response------", myobj)


                console.log("Response**stock*", $scope.allimg)
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }

        });

    }


//websocket-stock.herokuapp.com
//         var socket = io.connect("https://websocket-stock.herokuapp.com")
//
//         socket.on('connect', function () {
//         socket.emit('room', "p");
//         socket.on('message', data => {
//
//             for (const key in data) {
//                 var item73 = $scope.all.find(function (element) {
//
//                     return (element.name == data[i].name);
//
//                 })
//                 if (typeof item73 != typeof undefined) {
//                     for (const ky in data[key]) {
//                         if (data.hasOwnProperty(key)) {
//                             item73[ky] = data[key][ky];
//
//                         }
//                     }
//
//                 }
//                 $scope.$apply()
//             }
//             //
//         })
//     })


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


