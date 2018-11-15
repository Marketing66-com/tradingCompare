
var Chart_stockApp = angular.module('Chart_stockApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

Chart_stockApp.controller("Chart_stockController", function ($scope, $http) {

    $scope.stocks = []
    $scope.last_price = {}
    $scope.mystock

    var i = 0
    $scope.init = function (symbol) {
        //console.log("symbol", symbol)

        $.ajax({
            url: "https://websocket-stock.herokuapp.com/getStockPrice/" +  symbol,
            type: "GET",
            success: function (result) {
                //console.log("result ***",result)
                $scope.mystock = result
                $scope.last_price = result.price
                console.log(" $scope.mystock ***", $scope.mystock)

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
                $scope.mystock.point = Number(Number(Math.abs(result['price_open'] - result['price'])).toFixed(2));

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
        //DESCRIPTION
        $.ajax({
            url: "https://api.iextrading.com/1.0/stock/" + symbol + "/company",
            type: "GET",
            success: function (result) {
                //console.log("result ***",result)
                $scope.description = result.description
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });


    /**************************** Socket **********************/

    //STOCK
    var socketStock = io.connect("https://ws-api.iextrading.com/1.0/last");
    socketStock.emit("subscribe", symbol);

    socketStock.on("message", (data) => {
        data = JSON.parse(data);
        console.log("data", data)
        $scope.mystock.price = data.price
        console.log("data.price ", data.price,"$scope.last_price",$scope.last_price )

        if(data.price >= $scope.last_price)
            $scope.mystock.variation = "up"
        else
            $scope.mystock.variation = "down"


        if($scope.mystock.price_open == "N/A" || typeof $scope.mystock.price_open == "undefined" ){
            $scope.mystock.price_open = $scope.last_price;
        }

        $scope.mystock.change_pct = Number((((data.price - Number($scope.mystock.price_open)) / Number($scope.mystock.price_open)) * 100).toFixed(2))
        $scope.mystock.point = Number((Number($scope.mystock.price_open) - data.price).toFixed(10))
        $scope.last_price = data.price
        //console.log("data.price ", data.price,"$scope.last_price",$scope.last_price , $scope.mystock.change_pct )

        $scope.$apply()

    })
  }
});

var dvChart_stock = document.getElementById('dvChart_stock');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart_stock, ['Chart_stockApp']);
});
