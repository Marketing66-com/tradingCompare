
var Chart_forexApp = angular.module('forexApp', ['ui.bootstrap','memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})


Chart_forexApp.controller("Chart_forexController", function ($scope,$window,$location,MemberService,$http,$interval,$timeout,$uibModal) {

    $scope.sentiment;
    $scope.name;
    $scope.img;
    $scope.forex_sentiments = {}
    $scope.call_finished = false

    $scope.from;
    $scope.to;

    $scope.current_room = $scope.from + $scope.to

    ///////////////////////////////////////// SOCKET ///////////////////////////////////////////
    $scope.socket = io.connect('https://forex.tradingcompare.com');
    $scope.socket.on('connect', () => {
        $scope.socket.emit('room',  $scope.current_room );
    })
    $scope.socket.on('message', data => {
       // console.log("data******", data.variation, data.price);
        $scope.myforex = data

        if (data.variation == "down") {
                jQuery("cq-current-price").text(data.price).removeClass('positive')
                    .addClass('negative')
        }
        else if (data.variation == "up") {
                jQuery("cq-current-price").text(data.price).removeClass('negative')
                    .addClass('positive')
        }
        else if (data.variation == "none"){
            jQuery("cq-current-price").text(data.price).removeClass('negative').removeClass('positive')
        }
        if (data.change24 > 0) {
            jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
                .format(data.change24) + "%").removeClass('negative')
                .addClass('positive').css({'font-size': 15});
        } else {
            jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
                .format(data.change24) + "%").removeClass('positive')
                .addClass('negative').css({'font-size': 15});
        }

        $scope.myforex.name = $scope.name
        $scope.myforex.img = $scope.img

        $scope.$apply()
    })
    ///////////////////////////////////////// End SOCKET ///////////////////////////////////////////

    $scope.init = function (from,to) {
        $scope.from = from
        $scope.to = to
        $scope.mypair = from + to
        //console.log("api",from,to)

        $http.get("https://forex.tradingcompare.com/all_data/" + $scope.mypair)
            .then(function(result) {
                $scope.myforex = result.data
                // IMAGE
                if ($scope.myforex.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png" ||
                    $scope.myforex.img == undefined ||
                    typeof $scope.myforex.img == "undefined")
                    $scope.myforex.img = "/img/Stock_Logos/stocks.png"

                //IN WATCHLIST
                $scope.is_in_watchlist = false

                //SENTIMENT USER
                $scope.status_sentiment = 'CLOSE'
                $scope.type_sentiment = 'none'

                $scope.name = $scope.myforex.name
                $scope.img = $scope.myforex.img

                return $scope.myforex

            })
            .then((myforex)=>{
                fill_Chart_Change_Price(myforex)

                //SENTIMENT
                $http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiment-by-symbol/" +  $scope.mypair)
                    .then(function(result) {

                        result.data.forEach(element => {
                            if(element.type == 'BULLISH') {$scope.forex_sentiments['BULLISH'] = element.count }
                            else {$scope.forex_sentiments['BEARISH'] = element.count }

                        })
                        $scope.total_sentiments = $scope.forex_sentiments

                        if( Number($scope.forex_sentiments.BULLISH) >=
                            Number($scope.forex_sentiments.BEARISH) ){
                            $scope.more_bullish = true
                        }
                        else {
                            $scope.more_bullish = false
                        }

                        if(Number($scope.total_sentiments.BULLISH) == 0 && Number($scope.total_sentiments.BEARISH) == 0){
                            var sent = 50
                        }
                        else{
                            $scope.max_sentiment = Math.max($scope.forex_sentiments.BEARISH,
                                $scope.forex_sentiments.BULLISH)
                            var sent=($scope.max_sentiment / ($scope.forex_sentiments.BEARISH +
                                $scope.forex_sentiments.BULLISH)) *100
                        }
                        $scope.sentiment = Number(sent.toFixed(1))
                    })
                    .catch(function (error) {
                        $scope.data = error;
                        console.log("$scope.data", $scope.data)
                        // $scope.$apply();
                    })
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                // $scope.$apply();
            })

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

                    MemberService.getSentimentsByUser($scope.idToken, user.uid).then(function (results) {
                        console.log("getSentimentsByUser")
                        $scope.user_sentiments = results
                        if($scope.user_sentiments.length>0) {
                            $scope.user_sentiments.forEach(element => {
                                if(element.symbol == $scope.mypair && element.status == 'OPEN'){
                                    if( $scope.myforex != undefined){
                                        $scope.status_sentiment = 'OPEN'
                                        $scope.type_sentiment = element.type
                                    }
                                    else{
                                        var check = function() {
                                            //console.log("in timeout",$scope.call_finished)
                                            if( $scope.myforex != undefined){
                                                console.log("wait for")
                                                $timeout(check, 100);
                                            }
                                            else{
                                                $scope.status_sentiment = 'OPEN'
                                                $scope.type_sentiment = element.type
                                            }
                                        }
                                        $timeout(check, 100)
                                    }
                                }
                            });
                            //console.log("finish")
                        }
                        $scope.$apply();
                    }) .catch(function (error) {
                        $scope.data = error;
                        console.log("$scope.data", $scope.data)
                        $scope.$apply();
                    })

                    MemberService.getUsersById(idToken, $scope._id).then(function (results) {
                        console.log("getUsersById")
                        $scope.user = results.data
                        //console.log("$scope.user ",$scope.user)
                        if($scope.user.watchlist.length>0){
                            $scope.user.watchlist.forEach(currencie => {
                                //console.log("currencie",currencie)
                                if(currencie.symbol ==  $scope.mypair) {
                                    if(  $scope.myforex != undefined){
                                        $scope.is_in_watchlist = true
                                    }
                                    else{
                                        //console.log("in else")
                                        var check = function() {
                                            //console.log("in timeout",$scope.call_finished)
                                            if(  $scope.myforex != undefined){
                                                $scope.is_in_watchlist = true
                                            }
                                            else{
                                                console.log("wait for")
                                                $timeout(check, 100);
                                            }
                                        }
                                        $timeout(check, 100)
                                    }
                                }
                            });
                        }
                        $scope.$apply();
                    })
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

        function fill_Chart_Change_Price(object) {
            if (object.change24 > 0) {
                jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
                    .format(object.change24) + "%")
                    .addClass('positive').css({'font-size': 15});
            } else {
                jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
                    .format(object.change24) + "%")
                    .addClass('negative').css({'font-size': 15});
            }
            jQuery("cq-current-price").text(object.price);
        }

    }

//**********************************************************************
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

        $scope.is_in_watchlist = false

        $scope.data_to_send ={
            data: { symbol:$scope.myforex.pair,
                type:"FOREX"
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

        $scope.is_in_watchlist =  true

        $scope.data_to_send ={
            data: { symbol: $scope.myforex.pair,
                type:"FOREX"
            },
            _id: $scope.user._id
        }
        //console.log( $scope.data_to_send,$scope.mystock)
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
        //console.log("in add", type,total_sentiments)
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

        $scope.status_sentiment =  'OPEN'
        $scope.type_sentiment =  type

        //*** bar ***//
        if(type == 'BULLISH') {
            total_sentiments.BULLISH = Number(total_sentiments.BULLISH + 1);
        }
        else {
            total_sentiments.BEARISH = Number(total_sentiments.BEARISH + 1);
        }

        if( Number(total_sentiments.BULLISH) >= Number(total_sentiments.BEARISH) ){
            $scope.more_bullish = true
        }
        else {
            $scope.more_bullish = false
        }

        $scope.max_sentiment = Math.max(total_sentiments.BEARISH,
            total_sentiments.BULLISH)
        var sent=($scope.max_sentiment / (total_sentiments.BEARISH +
            total_sentiments.BULLISH)) *100

        $scope.sentiment=Number(sent.toFixed(1))
        // //*** bar ***//

        $scope.data_to_send ={
            _id: $scope.user._id,
            symbol: $scope.myforex.pair,
            symbol_type: "FOREX",
            type: type,
            price:  $scope.myforex.price
        }

        $scope.data_to_send["close_date"] = null;
        $scope.data_to_send["close_price"] = null;
        $scope.data_to_send["status"] = 'OPEN'
        $scope.data_to_send["user_id"] = $scope.user._id
        $scope.d = new Date();
        $scope.data_to_send["date"] = $scope.d.getFullYear() + "-" + ($scope.d.getMonth() + 1) + "-" + $scope.d.getDate()

        //console.log($scope.data_to_send,$scope.myforex )
        MemberService.Add_sentiment($scope.idToken, $scope.data_to_send).then(function (results) {
            //console.log("results",results.data)
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
            resolve:{forex:$scope.myforex}
        });

        modalInstance.result.then(function(response){
            // var url =  Routing.generate('template',{"_locale": _locale })
            var url =  Routing.generate('template')
            // console.log("url",url)
            $window.location= url
        });

    };
});

Chart_forexApp.controller('OpenSentimentCtrl', function($scope, $uibModalInstance,forex) {

    $scope.sentiment_curr = forex.name
    //console.log($scope.sentiment_curr ,"***********")
    $scope.ok = function(){
        $uibModalInstance.close("Ok");
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss();
    }

});

var dvChart_forex= document.getElementById('dvChart_forex');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart_forex, ['forexApp']);
});
