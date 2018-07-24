
// (function(window) {
var Chart_stockApp = angular.module('Chart_stockApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})


// var demo = angular.module('LiveFeedsApp', []).config(function ($interpolateProvider) {
//     $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
// });

Chart_stockApp.controller("Chart_stockController", function ($scope, $http) {

    $scope.stocks = []
    $scope.images = {}
    $scope.myimage = []
    $scope.myimage = []
    $scope.all = []
    $scope.alllikes = {}
    $scope.element={}

    var i = 0
    $scope.init = function (api, currency,likes) {
         console.log("api", api, "currency",currency)

        $.ajax({
            url: api,
            type: "GET",
            success: function (result) {
                //console.log("result $scope.all1",result)
                $scope.stocks = result
                console.log(" $scope.stocks", $scope.stocks)

                $scope.all.push($scope.stocks)
                console.log(" $scope.all", $scope.all)

                for (key in  $scope.stocks) {
                    //console.log($scope.all1[key].name)
                    if ($scope.stocks[key].name == currency) {
                        //console.log("*****")
                        $scope.mystock = result[key]
                        console.log("*****",$scope.mystock )
                        //console.log("api************found", from, to,$scope.mycrypto )
                    }
                }

                $scope.$apply()
            },

            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

// var allimg={}

        // console.log("img", img)
        //
        // $.ajax({
        //     url: img,
        //     type: "GET",
        //     success: function (result) {
        //         $scope.images = result
        //         console.log("result $scope.images",  $scope.images)
        //         for (var i = 0; i < $scope.images.length; i++) {
        //             if($scope.images[i].symbol == currency)
        //             {   $scope.allimg[$scope.images[i].symbol] = {img: $scope.images[i].img}
        //                 console.log("$scope.allimg",$scope.allimg)
        //                 //$scope.myimage =  $scope.images[i].img
        //                 $scope.myname = $scope.images[i].name
        //                 //console.log("$scope.allimg", $scope.allimg["FB"].img)
        //                 console.log("$scope.myname",$scope.myname)
        //             }
        //
        //
        //         }
        //         // for (const key in myobj) {
        //         //     if (myobj.hasOwnProperty(key)) {
        //         //         const element = myobj[key];
        //         //         $scope.allimg.push(element)
        //         //     }}
        //         //  console.log("Response------", myobj)
        //
        //         $scope.$apply()
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         console.log("ERROR", thrownError, xhr, ajaxOptions)
        //     }
        //
        // });

        ////////////////////////////////////////////////////////////////////
        console.log("likes", likes)
        $.ajax({
            url: likes,
            type: "GET",
            success: function (result) {
                $scope.alllikes = result
                for (const key in $scope.alllikes) {
                    $scope.element[$scope.alllikes[key].symbol] = $scope.alllikes[key]
                    var sent = ($scope.element[$scope.alllikes[key].symbol].likes / ($scope.element[$scope.alllikes[key].symbol].likes + $scope.element[$scope.alllikes[key].symbol].unlikes)) * 100
                    // console.log("Response*likes*", sent)
                    $scope.element[$scope.alllikes[key].symbol].sentiment = Number(sent.toFixed(1))

                }
                for (const key in $scope.element) {

                    if ($scope.element[key].symbol == currency) {
                        $scope.allimg = $scope.element[key]
                    }

                }

                console.log("Response*likes*", $scope.allimg)

                $scope.$apply()


            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        })

    }


    //
    // var socket = io.connect("https://websocket-stock.herokuapp.com")
    //
    // socket.on('connect', function () {
    //     socket.emit('room', "persec");
    //     socket.on('message', data => {
    //         //console.log("STOCK RESP", data)
    //         for (const key in data) {
    //         var item73 = $scope.all.find(function (element) {
    //
    //             return (element[0][key].name == data[key].name);
    //
    //         })
    //         if (typeof item73 != typeof undefined) {
    //             for (const ky in data[key]) {
    //                 if (data.hasOwnProperty(key)) {
    //                     item73[ky] = data[key][ky];
    //
    //                 }
    //             }
    //
    //         }
    //         $scope.$apply()
    //     }
    //     //
    // })
    // })

});

var dvChart_stock = document.getElementById('dvChart_stock');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart_stock, ['Chart_stockApp']);
});
//
// })(window);


