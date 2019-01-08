var Chart_stockApp = angular.module('Chart_stockApp', ['ui.bootstrap','memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

Chart_stockApp.controller("Chart_stockController", function ($scope,$window,$location,MemberService,$http,$interval,$timeout,$uibModal) {

    $scope.stocks = []
    $scope.last_price = {}
    $scope.mystock
    $scope.stock_sentiments = {}

    $scope.call_finished = false

    var i = 0
    $scope.init = function (symbol) {
        $scope.spinner = true

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

                    var promises1 = GetUserId( $scope.idToken,$scope._id)
                    var promises2 = GetUserSentiment( $scope.idToken,user.uid)

                    var all_promises = [promises1,promises2]

                    Promise.all(all_promises) .then((Arrays) => {
                        Arrays[0] = $scope.user;
                        Arrays[1] = $scope.user_sentiments;
                    }).then(()=>{
                        if( $scope.call_finished == true){
                            $scope.user_sentiments.forEach(element => {
                                if (element.symbol == symbol && element.status == 'OPEN') {
                                    $scope.mystock.status_sentiment = 'OPEN'
                                    $scope.mystock.type_sentiment = element.type
                                }
                            })
                            $scope.user_sentiments_finished = true

                            $scope.user.watchlist.forEach(currencie => {
                                if(currencie.symbol == symbol) {
                                    $scope.mystock.is_in_watchlist = true
                                }
                            })
                            $scope.user_watchlist_finished = true
                        }
                        else{
                            var check = function() {
                                if($scope.call_finished == false) {
                                    console.log("wait for")
                                    $timeout(check, 100);
                                }
                                else{
                                    $scope.user_sentiments.forEach(element => {
                                        if (element.symbol == symbol && element.status == 'OPEN') {
                                            $scope.mystock.status_sentiment = 'OPEN'
                                            $scope.mystock.type_sentiment = element.type
                                        }
                                    })
                                    $scope.user_sentiments_finished = true

                                    $scope.user.watchlist.forEach(currencie => {
                                        if(currencie.symbol == symbol) {
                                            $scope.mystock.is_in_watchlist = true
                                        }
                                    })
                                    $scope.user_watchlist_finished = true
                                }
                            }
                            $timeout(check, 100)
                        }
                        $scope.$apply();
                    })
                    .then(()=>{
                        var check = function() {
                            if($scope.idToken != undefined &&
                                $scope.user != undefined &&
                                $scope.user_sentiments_finished == true &&
                                $scope.user_watchlist_finished == true) {
                                $scope.spinner = false
                            }
                            else{
                                // console.log("wait for, watchlist")
                                $timeout(check, 100);
                            }
                        }
                        $timeout(check, 100)
                    })
                }).catch(function (error) {
                    console.log('ERROR: ', error)
                });
                $scope.$apply();
            }
            else{
                $scope.userLoggedIn = false;
                $scope.spinner = false
                $scope.$apply();
            }
        });

        //************************************
        $http.get("https://websocket-stock.herokuapp.com/getStockPrice/" +  symbol)
            .then(function(result) {
                //console.log("result ***", result)
                $scope.mystock = result.data
                $scope.last_price = result.data.price

                if (result.length == 0) {
                    $http.get("https://interactivecrypto.herokuapp.com/getLastRecord/" + symbol)
                        .then(function (response) {
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

                //SENTIMENT USER
                $scope.mystock.status_sentiment = 'CLOSE'
                $scope.mystock.type_sentiment = 'none'

                //POINT
                $scope.mystock.point = Number(Number(Math.abs($scope.mystock['price_open'] - $scope.mystock['price'])).toFixed(2));

                //SYMBOL
                if($scope.mystock.symbol.indexOf('.') > -1)
                    $scope.mystock.symbol = $scope.mystock.symbol.split(".")[0]

                //IN WATCHLIST
                $scope.mystock.is_in_watchlist = false

                //INFO GRAPH
                if ($scope.mystock.change_pct > 0) {
                    jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
                        .format($scope.mystock.change_pct) + "%")
                        .addClass('positive').css({'font-size': 15});
                } else {
                    jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
                        .format($scope.mystock.change_pct) + "%")
                        .addClass('negative').css({'font-size': 15});
                }
                jQuery("cq-current-price").text($scope.mystock.price);

            })
            .then(() => {
                $scope.call_finished = true

                //SENTIMENT
                $http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiment-by-symbol/" +  symbol)
                    .then(function(result) {

                        result.data.forEach(element => {
                            if(element.type == 'BULLISH') {$scope.stock_sentiments.BULLISH = element.count }
                            else {$scope.stock_sentiments.BEARISH = element.count }
                        })
                        $scope.total_sentiments = $scope.stock_sentiments

                        if( Number($scope.stock_sentiments.BULLISH) >=
                            Number($scope.stock_sentiments.BEARISH) ){
                            $scope.mystock.more_bullish = true
                        }
                        else {
                            $scope.mystock.more_bullish = false
                        }

                        if($scope.stock_sentiments.BULLISH == 0 && $scope.stock_sentiments.BEARISH == 0){
                            var sent = 50
                        }
                        else{
                            $scope.max_sentiment = Math.max($scope.stock_sentiments.BEARISH,
                                $scope.stock_sentiments.BULLISH)
                            var sent=($scope.max_sentiment / ($scope.stock_sentiments.BEARISH +
                                $scope.stock_sentiments.BULLISH)) *100
                        }
                        $scope.mystock.sentiment=Number(sent.toFixed(1))
                    })
                    .catch(function (error) {
                        $scope.data = error;
                        console.log("error", $scope.data)
                        $scope.$apply()
                    })
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("error", $scope.data)
                $scope.$apply()
            })

        //*******************************
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

    //******************************************
    //** WATCHLIST
    $scope.delete_from_watchlist = function() {

        if($scope.user == undefined || $scope.user.length == 0 ){
            console.log("return")
            return;
        }
        if($scope.user.phone_number == ""){
            $('.modal_sigh-up').slideDown();
            return;
        }
        if(!$scope.user.verifyData.is_phone_number_verified){
            $('.modal_sigh-up').slideDown();
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
            //console.log("delete",results)
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
        if($scope.user.phone_number == ""){
            $('.modal_sigh-up').slideDown();
            return;
        }
        if(!$scope.user.verifyData.is_phone_number_verified){
            $('.modal_sigh-up').slideDown();
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

    // ***** SENTIMENTS *****
    $scope.add_sentiment = function(type, total_sentiments) {
        //console.log("in add", total_sentiments,type)
        if($scope.user == undefined || $scope.user.length == 0 ){
            console.log("return")
            return;
        }
        if($scope.user.phone_number == ""){
            $('.modal_sigh-up').slideDown();
            return;
        }
        if(!$scope.user.verifyData.is_phone_number_verified){
            $('.modal_sigh-up').slideDown();
            return;
        }

        $scope.mystock.status_sentiment =  'OPEN'
        $scope.mystock.type_sentiment =  type

        //*** bar ***//
        if(type == 'BULLISH') {
            total_sentiments.BULLISH = Number(total_sentiments.BULLISH + 1);
        }
            else {
                total_sentiments.BEARISH = Number(total_sentiments.BEARISH + 1);
            }

        if( Number(total_sentiments.BULLISH) >= Number(total_sentiments.BEARISH) ){
            $scope.mystock.more_bullish = true
        }
            else {
                $scope.mystock.more_bullish = false
            }

        $scope.max_sentiment = Math.max(total_sentiments.BEARISH,
            total_sentiments.BULLISH)
        var sent=($scope.max_sentiment / (total_sentiments.BEARISH +
            total_sentiments.BULLISH)) *100

        $scope.mystock.sentiment=Number(sent.toFixed(1))
        // //*** bar ***//

        $scope.data_to_send ={
            _id: $scope.user._id,
            symbol: $scope.mystock.symbol,
            symbol_type: "STOCK",
            type: type,
            price:  $scope.mystock.price
        }

        $scope.data_to_send["close_date"] = null;
        $scope.data_to_send["close_price"] = null;
        $scope.data_to_send["status"] = 'OPEN'
        $scope.data_to_send["user_id"] = $scope.user._id
        $scope.d = new Date();
        $scope.data_to_send["date"] = $scope.d.getFullYear() + "-" + ($scope.d.getMonth() + 1) + "-" + $scope.d.getDate()

        //console.log($scope.data_to_send,$scope.mystock )
        MemberService.Add_sentiment($scope.idToken, $scope.data_to_send).then(function (results) {
            console.log("results",results.data)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    }

    $scope.AlreadyOpen = function() {
        if($scope.user_sentiments == undefined) {
            console.log("return")
            return;
        }

        var modalInstance =  $uibModal.open({
            templateUrl: '/js/sentiment_already_exist.html',
            controller: "OpenSentimentCtrl",
            size: '',
            resolve:{stock:$scope.mystock}
        });

        modalInstance.result.then(function(response){
            // var url =  Routing.generate('template',{"_locale": _locale })
            var url =  Routing.generate('social_sentiment')
            // console.log("url",url)
            $window.location= url
        });

    };

    var GetUserId = function (idToken, uid){
        return new Promise(function (resolve, reject) {
            MemberService.getUsersById(idToken, uid).then(function (results) {
                console.log("getUsersById")
                $scope.user = results.data
                resolve($scope.user)
                $scope.$apply();
            })
            .catch(function (error) {
                    $scope.data = error;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
            })
        });
    }

    var GetUserSentiment = function (idToken, uid){
        return new Promise(function (resolve, reject) {
            MemberService.getSentimentsByUser(idToken, uid).then(function (results) {
                console.log("getSentimentsByUser")
                $scope.user_sentiments = results
                resolve ($scope.user_sentiments)
                $scope.$apply();
            })
            .catch(function (error) {
                    $scope.data = error;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
            })
        });
    }
});


Chart_stockApp.controller('OpenSentimentCtrl', function($scope, $uibModalInstance, stock) {

    $scope.sentiment_curr = stock.name

    $scope.ok = function(){
        $uibModalInstance.close("Ok");
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss();
    }

});


var dvChart_stock = document.getElementById('dvChart_stock');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart_stock, ['Chart_stockApp']);
});
//
//
// var Chart_stockApp = angular.module('Chart_stockApp', ['ui.bootstrap','memberService']).config(function ($interpolateProvider) {
//     $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})
//
// Chart_stockApp.controller("Chart_stockController", function ($scope,$window,$location,MemberService,$http,$interval,$timeout,$uibModal) {
//
//     $scope.stocks = []
//     $scope.last_price = {}
//     $scope.mystock = {}
//     $scope.stock_sentiments = {}
//
//     $scope.call_finished = false
//
//     var i = 0
//     $scope.init = function (symbol) {
//         //console.log("symbol", symbol)
//
//         firebase.auth().onAuthStateChanged(function (user) {
//             if (user) {
//                 $scope.userLoggedIn = true;
//                 //console.log("getuser",user)
//                 user.getIdToken(true).then(function (idToken) {
//                     console.log("getIdToken")
//                     $scope.idToken = idToken
//                     $scope._id = {
//                         _id: user.uid
//                     }
//                     MemberService.getUsersById(idToken, $scope._id).then(function (results) {
//                         console.log("getUsersById")
//                         $scope.user = results.data
//                         //console.log("$scope.user ",$scope.user)
//                         if($scope.user.watchlist.length>0){
//                             $scope.user.watchlist.forEach(currencie => {
//                                 //console.log("currencie",currencie)
//                                 if(currencie.symbol == symbol) {
//                                     if( $scope.call_finished == true){
//                                         $scope.mystock.is_in_watchlist = true
//                                     }
//                                     else{
//                                         //console.log("in else")
//                                         var check = function() {
//                                             console.log("in timeout",$scope.call_finished)
//                                             if($scope.call_finished == false) {
//                                                 console.log("wait for")
//                                                 $timeout(check, 100);
//                                             }
//                                             else{
//                                                 //console.log("in else")
//                                                 $scope.mystock.is_in_watchlist = true
//                                             }
//                                         }
//                                         $timeout(check, 100)
//                                     }
//                                 }
//                             });
//                         }
//                         $scope.$apply();
//
//                     })
//                     .catch(function (error) {
//                             $scope.data = error;
//                             console.log("$scope.data", $scope.data)
//                             $scope.$apply();
//                     })
//
//
//                     MemberService.getSentimentsByUser($scope.idToken, user.uid).then(function (results) {
//                         console.log("getSentimentsByUser",results)
//                         $scope.user_sentiments = results
//                         if($scope.user_sentiments.length>0) {
//                             $scope.user_sentiments.forEach(element => {
//                                 if(element.symbol == symbol && element.status == 'OPEN'){
//                                     if( $scope.call_finished == true){
//                                         $scope.mystock.status_sentiment = 'OPEN'
//                                         $scope.mystock.type_sentiment = element.type
//                                     }
//                                     else{
//                                         var check = function() {
//                                             //console.log("in timeout",$scope.call_finished)
//                                             if($scope.call_finished == false) {
//                                                 console.log("wait for")
//                                                 $timeout(check, 100);
//                                             }
//                                             else{
//                                                 $scope.mystock.status_sentiment = 'OPEN'
//                                                 $scope.mystock.type_sentiment = element.type
//                                             }
//                                         }
//                                         $timeout(check, 100)
//                                     }
//                                 }
//                             });
//                         }
//                         $scope.$apply();
//                     }) .catch(function (error) {
//                         $scope.data = error;
//                         console.log("$scope.data", $scope.data)
//                         $scope.$apply();
//                     })
//
//                 }).catch(function (error) {
//                     console.log('ERROR: ', error)
//                 });
//                 $scope.$apply();
//             }
//             else{
//                 $scope.userLoggedIn = false;
//                 $scope.$apply();
//             }
//         });
//
// //*******************************
//         $http.get("https://websocket-stock.herokuapp.com/getStockPrice/" +  symbol)
//             .then(function(result) {
//                 console.log("result ***",result)
//                 $scope.mystock = result.data
//                 console.log("$scope.mystock",$scope.mystock)
//                 $scope.last_price = result.data.price
//
//                 if(result.length == 0){
//                     $http.get("https://interactivecrypto.herokuapp.com/getLastRecord/" + symbol)
//                         .then(function(response) {
//                             console.log("response database")
//                             $scope.mystock = response.data
//                             $scope.last_price = response.data.price
//                         });
//                 }
//                         //IMAGE
//                         var img = "https://storage.googleapis.com/iex/api/logos/" + $scope.mystock.symbol + ".png"
//                         if($scope.mystock.img == undefined || typeof $scope.mystock.img == "undefined" || img == undefined || typeof img == "undefined")
//                             $scope.mystock.img = "/img/Stock_Logos/stocks.png"
//                         else
//                             $scope.mystock.img = img
//
//                         //SYMBOL
//                         if($scope.mystock.symbol.indexOf('.') > -1)
//                             $scope.mystock.symbol = $scope.mystock.symbol.split(".")[0]
//
//                         //SENTIMENT
//                         // if($scope.stock_sentiments.hasOwnProperty(symbol)){
//                         //     if( Number($scope.stock_sentiments.BULLISH) >=
//                         //         Number($scope.stock_sentiments.BEARISH) ){
//                         //         $scope.mystock.more_bullish = true
//                         //     }
//                         //     else {
//                         //         $scope.mystock.more_bullish = false
//                         //     }
//                         //
//                         //     $scope.max_sentiment = Math.max($scope.stock_sentiments.BEARISH,
//                         //         $scope.stock_sentiments.BULLISH)
//                         //
//                         //     var sent=($scope.max_sentiment / ($scope.stock_sentiments.BEARISH +
//                         //         $scope.stock_sentiments.BULLISH)) *100
//                         // }
//                         // else{
//                         //     var sent = 50
//                         //     $scope.mystock.more_bullish = true
//                         // }
//                          var sent = ($scope.mystock.likes / ($scope.mystock.likes + $scope.mystock.unlikes)) * 100
//                         $scope.mystock.sentiment = Number(sent.toFixed(1))
//                         $scope.sentiment = Number(sent.toFixed(1))
//
//                         //POINT
//                         $scope.mystock.point = Number(Number(Math.abs(result['price_open'] - result['price'])).toFixed(2));
//
//                         //SYMBOL
//                         if($scope.mystock.symbol.indexOf('.') > -1)
//                             $scope.mystock.symbol = $scope.mystock.symbol.split(".")[0]
//
//                         //IN WATCHLIST
//                         $scope.mystock.is_in_watchlist = false
//
//                         //SENTIMENT USER
//                         $scope.mystock.status_sentiment = 'CLOSE'
//                         $scope.mystock.type_sentiment = 'none'
//
//                         //INFO GRAPH
//                         if (result.change_pct > 0) {
//                             jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
//                                 .format(result.change_pct) + "%")
//                                 .addClass('positive').css({'font-size': 15});
//                         } else {
//                             jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
//                                 .format(result.change_pct) + "%")
//                                 .addClass('negative').css({'font-size': 15});
//                         }
//                         jQuery("cq-current-price").text(result.price);
//                     })
//                     .then(() => {
//                         $scope.call_finished = true
//                         console.log("******", $scope.mystock)
//                     })
//                     .catch(function (error) {
//                         $scope.data = error;
//                         console.log("error", $scope.data)
//                         // $scope.$apply();
//                     })
//
//
//
//         ////////////////////////////////////////////////////////////////////
//         //DESCRIPTION
//         $.ajax({
//             url: "https://api.iextrading.com/1.0/stock/" + symbol + "/company",
//             type: "GET",
//             success: function (result) {
//                 //console.log("result ***",result)
//                 $scope.description = result.description
//                 $scope.$apply()
//             },
//             error: function (xhr, ajaxOptions, thrownError) {
//                 console.log("ERROR", thrownError, xhr, ajaxOptions)
//             }
//         });
//
//         //*********************************************************************
//         $scope.delete_from_watchlist = function() {
//
//             if($scope.user == undefined || $scope.user.length == 0 ){
//                 console.log("return")
//                 return;
//             }
//             if($scope.user.phone_number == ""){
//                 $('.modal_sigh-up').slideDown();
//                 return;
//             }
//             if(!$scope.user.verifyData.is_phone_number_verified){
//                 $('.modal_sigh-up').slideDown();
//                 return;
//             }
//
//             $scope.mystock.is_in_watchlist = false
//
//             $scope.data_to_send ={
//                 data: { symbol:$scope.mystock.symbol,
//                     type:"STOCK"
//                 },
//                 _id: $scope.user._id
//             }
//
//             MemberService.Delete_from_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
//                 console.log("delete",results)
//             })
//                 .catch(function (error) {
//                     $scope.data = error;
//                     console.log("$scope.data", $scope.data)
//                     $scope.$apply();
//                 })
//
//         }
//         $scope.add_to_watchlist = function() {
//
//             if($scope.user == undefined || $scope.user.length == 0 ){
//                 console.log("return")
//                 return;
//             }
//             if($scope.user.phone_number == ""){
//                 $('.modal_sigh-up').slideDown();
//                 return;
//             }
//             if(!$scope.user.verifyData.is_phone_number_verified){
//                 $('.modal_sigh-up').slideDown();
//                 return;
//             }
//
//             $scope.mystock.is_in_watchlist =  true
//
//             $scope.data_to_send ={
//                 data: { symbol: $scope.mystock.symbol,
//                     type:"STOCK"
//                 },
//                 _id: $scope.user._id
//             }
//             console.log( $scope.data_to_send,$scope.mystock)
//             MemberService.Add_to_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
//                 //console.log("results",results)
//             })
//                 .catch(function (error) {
//                     $scope.data = error;
//                     console.log("$scope.data", $scope.data)
//                     $scope.$apply();
//                 })
//
//         }
//
//         $scope.click_on_star = function(){
//             $('.modal_sigh-up').slideDown();
//         }
//
//         // ***** SENTIMENTS *****
//         $scope.add_sentiment = function(type) {
//             // console.log("index",index, type,$scope.filteredItems[index])
//             if($scope.user == undefined || $scope.user.length == 0 ){
//                 console.log("return")
//                 return;
//             }
//             if($scope.user.phone_number == ""){
//                 $('.modal_sigh-up').slideDown();
//                 return;
//             }
//             if(!$scope.user.verifyData.is_phone_number_verified){
//                 $('.modal_sigh-up').slideDown();
//                 return;
//             }
//
//             $scope.mystock.status_sentiment =  'OPEN'
//             $scope.mystock.type_sentiment =  type
//
//             $scope.data_to_send ={
//                 _id: $scope.user._id,
//                 symbol: $scope.mystock.symbol,
//                 symbol_type: "STOCK",
//                 type: type,
//                 price:  $scope.mystock.price
//             }
//
//             $scope.data_to_send["close_date"] = null;
//             $scope.data_to_send["close_price"] = null;
//             $scope.data_to_send["status"] = 'OPEN'
//             $scope.data_to_send["user_id"] = $scope.user._id
//             $scope.d = new Date();
//             $scope.data_to_send["date"] = $scope.d.getFullYear() + "-" + ($scope.d.getMonth() + 1) + "-" + $scope.d.getDate()
//
//             console.log($scope.data_to_send,$scope.mystock )
//             MemberService.Add_sentiment($scope.idToken, $scope.data_to_send).then(function (results) {
//                 console.log("results",results.data)
//             })
//                 .catch(function (error) {
//                     $scope.data = error;
//                     console.log("$scope.data", $scope.data)
//                     $scope.$apply();
//                 })
//         }
//
//         $scope.AlreadyOpen = function() {
//             if($scope.user_sentiments == undefined) {
//                 console.log("return")
//                 return;
//             }
//
//             var modalInstance =  $uibModal.open({
//                 templateUrl: '/js/sentiment_already_exist.html',
//                 controller: "OpenSentimentCtrl",
//                 size: '',
//                 resolve:{stock:$scope.mystock}
//             });
//
//             modalInstance.result.then(function(response){
//                 // var url =  Routing.generate('template',{"_locale": _locale })
//                 var url =  Routing.generate('template')
//                 // console.log("url",url)
//                 $window.location= url
//             });
//
//         };
//
//         /**************************** Socket **********************/
//
//     //STOCK
//     var socketStock = io.connect("https://ws-api.iextrading.com/1.0/last");
//     socketStock.emit("subscribe", symbol);
//
//     socketStock.on("message", (data) => {
//         data = JSON.parse(data);
//         //console.log("data", data)
//         $scope.mystock.price = data.price
//         //console.log("data.price", data.price,"$scope.last_price",$scope.last_price )
//
//         if(data.price >= $scope.last_price)
//             $scope.mystock.variation = "up"
//         else
//             $scope.mystock.variation = "down"
//
//
//         if($scope.mystock.price_open == "N/A" || typeof $scope.mystock.price_open == "undefined" ){
//             $scope.mystock.price_open = $scope.last_price;
//         }
//
//         $scope.mystock.change_pct = Number((((data.price - Number($scope.mystock.price_open)) / Number($scope.mystock.price_open)) * 100).toFixed(2))
//         $scope.mystock.point = Number((Number($scope.mystock.price_open) - data.price).toFixed(10))
//         $scope.last_price = data.price
//         //console.log("data.price ", data.price,"$scope.last_price",$scope.last_price , $scope.mystock.change_pct )
//
//         // CHART INFO
//         if ($scope.mystock.change_pct > 0) {
//             jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
//                 .format($scope.mystock.change_pct) + "%").removeClass('negative')
//                 .addClass('positive').css({'font-size': 15});
//         } else if ($scope.mystock.change_pct < 0){
//             jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
//                 .format($scope.mystock.change_pct) + "%").removeClass('positive')
//                 .addClass('negative').css({'font-size': 15});
//         }
//         jQuery("cq-current-price").text(data.price);
//
//         $scope.$apply()
//
//     })
//   }
// });
//
//
// Chart_stockApp.controller('OpenSentimentCtrl', function($scope, $uibModalInstance, stock) {
//
//     $scope.sentiment_curr = stock.name
//
//     $scope.ok = function(){
//         $uibModalInstance.close("Ok");
//     }
//
//     $scope.cancel = function(){
//         $uibModalInstance.dismiss();
//     }
//
// });
//
// var dvChart_stock = document.getElementById('dvChart_stock');
//
// angular.element(document).ready(function() {
//
//     angular.bootstrap(dvChart_stock, ['Chart_stockApp']);
// });
//
