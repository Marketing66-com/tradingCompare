
var Chart_stockApp = angular.module('Chart_stockApp', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

Chart_stockApp.controller("Chart_stockController", function ($scope,$window,$location,MemberService,$http,$interval,$timeout) {

    $scope.stocks = []
    $scope.last_price = {}
    $scope.mystock

    $scope.call_finished = false

    var i = 0
    $scope.init = function (symbol) {
        //console.log("symbol", symbol)

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $scope.userLoggedIn = true;
                //console.log("getuser",user)
                user.getIdToken(true).then(function (idToken) {
                    console.log("getIdToken")
                    $scope.idToken = idToken
                    $scope._id = {
                        _id: user.uid
                    }
                    MemberService.getUsersById(idToken, $scope._id).then(function (results) {
                        console.log("getUsersById")
                        $scope.user = results.data
                        //console.log("$scope.user ",$scope.user)
                        if($scope.user.watchlist.length>0){
                            $scope.user.watchlist.forEach(currencie => {
                                //console.log("currencie",currencie)
                                if(currencie.symbol == symbol) {
                                    if( $scope.call_finished == true){
                                        $scope.mystock.is_in_watchlist = true
                                    }
                                    else{
                                        //console.log("in else")
                                        var check = function() {
                                            console.log("in timeout",$scope.call_finished)
                                            if($scope.call_finished == false) {
                                                console.log("wait for")
                                                $timeout(check, 100);
                                            }
                                            else{
                                                //console.log("in else")
                                                $scope.mystock.is_in_watchlist = true
                                            }
                                        }
                                        $timeout(check, 100)
                                    }
                                }
                            });
                        }
                        $scope.$apply();

                    })
                    // .then(() => {
                    //         console.log("mystock",$scope.mystock)
                    // })
                    .catch(function (error) {
                            $scope.data = error;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                    })

                }).catch(function (error) {
                    console.log('ERROR: ', error)
                });
                $scope.$apply();
            }
            else{
                $scope.userLoggedIn = false;
                $scope.$apply();
            }
        });

//*******************************
        $http.get("https://websocket-stock.herokuapp.com/getStockPrice/" +  symbol)
            .then(function(result) {
                console.log("result ***",result)
                $scope.mystock = result.data
                $scope.last_price = result.data.price

                if(result.length == 0){
                    $http.get("https://interactivecrypto.herokuapp.com/getLastRecord/" + symbol)
                        .then(function(response) {
                            console.log("response database")
                            $scope.mystock = response.data
                            $scope.last_price = response.data.price
                        });
                }

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

                //IN WATCHLIST
                $scope.mystock.is_in_watchlist = false

                //INFO GRAPH
                if (result.change_pct > 0) {
                    jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
                        .format(result.change_pct) + "%")
                        .addClass('positive').css({'font-size': 15});
                } else {
                    jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
                        .format(result.change_pct) + "%")
                        .addClass('negative').css({'font-size': 15});
                }
                jQuery("cq-current-price").text(result.price);
            })
            .then(() => {
                $scope.call_finished = true
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("error", $scope.data)
                // $scope.$apply();
            })
        //************************************
        // $.ajax({
        //     url: "https://websocket-stock.herokuapp.com/getStockPrice/" +  symbol,
        //     type: "GET",
        //     success: function (result) {
        //         console.log("result ***",result)
        //         $scope.mystock = result
        //         $scope.last_price = result.price
        //
        //         if(result.length == 0){
        //             $http.get("https://interactivecrypto.herokuapp.com/getLastRecord/" + symbol)
        //                 .then(function(response) {
        //                     $scope.mystock = response
        //                     $scope.last_price = response.price
        //                 });
        //         }
        //         //console.log(" $scope.mystock ***", $scope.mystock)
        //
        //         //IMAGE
        //         var img = "https://storage.googleapis.com/iex/api/logos/" + $scope.mystock.symbol + ".png"
        //         if($scope.mystock.img == undefined || typeof $scope.mystock.img == "undefined" || img == undefined || typeof img == "undefined")
        //             $scope.mystock.img = "/img/Stock_Logos/stocks.png"
        //         else
        //         $scope.mystock.img = img
        //
        //         //SYMBOL
        //         if($scope.mystock.symbol.indexOf('.') > -1)
        //             $scope.mystock.symbol = $scope.mystock.symbol.split(".")[0]
        //
        //         //SENTIMENT
        //         var sent=($scope.mystock.likes / ($scope.mystock.likes + $scope.mystock.unlikes)) *100
        //         $scope.mystock.sentiment=Number(sent.toFixed(1))
        //
        //         //POINT
        //         $scope.mystock.point = Number(Number(Math.abs(result['price_open'] - result['price'])).toFixed(2));
        //
        //         //SYMBOL
        //         if($scope.mystock.symbol.indexOf('.') > -1)
        //             $scope.mystock.symbol = $scope.mystock.symbol.split(".")[0]
        //
        //         //IN WATCHLIST
        //         $scope.mystock.is_in_watchlist = false
        //
        //         //INFO GRAPH
        //         if (result.change_pct > 0) {
        //             jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
        //                 .format(result.change_pct) + "%")
        //                 .addClass('positive').css({'font-size': 15});
        //         } else {
        //             jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
        //                 .format(result.change_pct) + "%")
        //                 .addClass('negative').css({'font-size': 15});
        //         }
        //         jQuery("cq-current-price").text(result.price);
        //         $scope.$apply()
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         console.log("ERROR", thrownError, xhr, ajaxOptions)
        //     }
        // });

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

//*********************************************************************
        $scope.delete_from_watchlist = function() {

            if($scope.user == undefined || $scope.user.length == 0 ){
                console.log("return")
                return;
            }
            $scope.mystock.is_in_watchlist = false

            $scope.data_to_send ={
                data: { symbol:$scope.mystock.symbol,
                    type:"STOCK"
                },
                _id: $scope.user._id
            }

            MemberService.Delete_from_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
                console.log("delete",results)
            })
                .catch(function (error) {
                    $scope.data = error;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
                })

        }
        $scope.add_to_watchlist = function() {

            if($scope.user == undefined || $scope.user.length == 0 ){
                console.log("return")
                return;
            }

            $scope.mystock.is_in_watchlist =  true

            $scope.data_to_send ={
                data: { symbol: $scope.mystock.symbol,
                    type:"STOCK"
                },
                _id: $scope.user._id
            }
            console.log( $scope.data_to_send,$scope.mystock)
            MemberService.Add_to_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
                //console.log("results",results)
            })
                .catch(function (error) {
                    $scope.data = error;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
                })

        }

        $scope.click_on_star = function(){
            $('.modal_sigh-up').slideDown();
        }
        /**************************** Socket **********************/

    //STOCK
    var socketStock = io.connect("https://ws-api.iextrading.com/1.0/last");
    socketStock.emit("subscribe", symbol);

    socketStock.on("message", (data) => {
        data = JSON.parse(data);
        //console.log("data", data)
        $scope.mystock.price = data.price
        //console.log("data.price", data.price,"$scope.last_price",$scope.last_price )

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

        // CHART INFO
        if ($scope.mystock.change_pct > 0) {
            jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
                .format($scope.mystock.change_pct) + "%").removeClass('negative')
                .addClass('positive').css({'font-size': 15});
        } else if ($scope.mystock.change_pct < 0){
            jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
                .format($scope.mystock.change_pct) + "%").removeClass('positive')
                .addClass('negative').css({'font-size': 15});
        }
        jQuery("cq-current-price").text(data.price);

        $scope.$apply()

    })
  }
});

var dvChart_stock = document.getElementById('dvChart_stock');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart_stock, ['Chart_stockApp']);
});

