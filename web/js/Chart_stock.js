
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
        console.log("currency",api, currency,likes)


        $.ajax({
            url: "https://websocket-stock.herokuapp.com/getStockPrice/" +  currency,
            type: "GET",
            success: function (result) {
                console.log("result ***",result)
                $scope.mystock = result[0]


                //IMAGE
                var img = "https://storage.googleapis.com/iex/api/logos/" + $scope.mystock.symbol + ".png"
                if($scope.mystock.img == undefined || typeof $scope.mystock.img == "undefined" || img == undefined || typeof img == "undefined")
                    $scope.mystock.img = "/img/Stock_Logos/stocks.png"
                else
                $scope.mystock.img = img

                //SYMBOL
                if($scope.mystock.symbol.indexOf('.') > -1)
                    $scope.mystock.symbol = $scope.mystock.symbol.split(".")[0]

                //SENTIMENT
                var sent=($scope.mystock.likes / ($scope.mystock.likes + $scope.mystock.unlikes)) *100
                $scope.mystock.sentiment=Number(sent.toFixed(1))

                //POINT
                $scope.mystock.point = Number(Number(Math.abs(result[0]['price_open'] - result[0]['price'])).toFixed(2));

                //SYMBOL
                if($scope.mystock.symbol.indexOf('.') > -1)
                    $scope.mystock.symbol = $scope.mystock.symbol.split(".")[0]

                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });


        ////////////////////////////////////////////////////////////////////
        // $.ajax({
        //     url: likes,
        //     type: "GET",
        //     success: function (result) {
        //         $scope.alllikes = result
        //         for (const key in $scope.alllikes) {
        //             $scope.element[$scope.alllikes[key].symbol] = $scope.alllikes[key]
        //             var sent = ($scope.element[$scope.alllikes[key].symbol].likes / ($scope.element[$scope.alllikes[key].symbol].likes + $scope.element[$scope.alllikes[key].symbol].unlikes)) * 100
        //             // console.log("Response*likes*", sent)
        //             $scope.element[$scope.alllikes[key].symbol].sentiment = Number(sent.toFixed(1))
        //
        //         }
        //         for (const key in $scope.element) {
        //
        //             if ($scope.element[key].symbol == currency) {
        //                 $scope.allimg = $scope.element[key]
        //             }
        //
        //         }
        //
        //         //console.log("Response*likes*", $scope.allimg)
        //
        //         $scope.$apply()
        //
        //
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         console.log("ERROR", thrownError, xhr, ajaxOptions)
        //     }
        // })

    }

});

var dvChart_stock = document.getElementById('dvChart_stock');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart_stock, ['Chart_stockApp']);
});



