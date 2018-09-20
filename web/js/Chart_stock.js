
var Chart_stockApp = angular.module('Chart_stockApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

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
        console.log("currency",currency)


        $.ajax({
            url: "https://websocket-stock.herokuapp.com/getStockPrice/" +  currency,
            type: "GET",
            success: function (result) {
                console.log("result ***",result)
                $scope.mystock = result[0]
                console.log("*****",$scope.mystock )
                $scope.$apply()
            },

            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        // $.ajax({
        //     url: api,
        //     type: "GET",
        //     success: function (result) {
        //         //console.log("result $scope.all1",result)
        //         $scope.stocks = result
        //         console.log(" $scope.stocks", $scope.stocks)
        //
        //         $scope.all.push($scope.stocks)
        //         console.log(" $scope.all", $scope.all)
        //
        //         for (key in  $scope.stocks) {
        //             //console.log($scope.all1[key].name)
        //             if ($scope.stocks[key].pair == currency) {
        //                 //console.log("*****")
        //                 $scope.mystock = result[key]
        //                 console.log("*****",$scope.mystock )
        //                 //console.log("api************found", from, to,$scope.mycrypto )
        //             }
        //         }
        //
        //         $scope.$apply()
        //     },
        //
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         console.log("ERROR", thrownError, xhr, ajaxOptions)
        //     }
        // });

        ////////////////////////////////////////////////////////////////////
        //console.log("likes", likes)
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

                //console.log("Response*likes*", $scope.allimg)

                $scope.$apply()


            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        })

    }

});

var dvChart_stock = document.getElementById('dvChart_stock');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart_stock, ['Chart_stockApp']);
});



