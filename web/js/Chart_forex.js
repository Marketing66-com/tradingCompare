
var Chart_forexApp = angular.module('forexApp', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})


Chart_forexApp.controller("Chart_forexController", function ($scope,$window,$location,MemberService,$http,$interval,$timeout) {

    $scope.sentiment;
    $scope.name;
    $scope.img;

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
        $scope.myforex.sentiment = $scope.sentiment

        $scope.$apply()
    })
    ///////////////////////////////////////// End SOCKET ///////////////////////////////////////////

    $scope.init = function (from,to) {
        $scope.from = from
        $scope.to = to
        $scope.mypair = from + to
        //console.log("api",from,to)

        $.ajax({
            url: "https://forex.tradingcompare.com/all_data/" + $scope.mypair,
            type: "GET",
            success: function (result) {

                $scope.myforex = result
                //console.log("$scope.myforex",  $scope.myforex )

                // IMAGE
                if ($scope.myforex.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png" ||
                    $scope.myforex.img == undefined ||
                    typeof $scope.myforex.img == "undefined")
                    $scope.myforex.img = "/img/Stock_Logos/stocks.png"

                //SENTIMENT
                var sent = ($scope.myforex.likes / ($scope.myforex.likes + $scope.myforex.unlikes)) * 100
                $scope.myforex.sentiment = Number(sent.toFixed(1))
                $scope.sentiment = Number(sent.toFixed(1))

                //IN WATCHLIST
                $scope.is_in_watchlist = false

                $scope.name = $scope.myforex.name
                $scope.img = $scope.myforex.img

                fill_Chart_Change_Price($scope.myforex)

                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

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
                        .then(() => {
                            //console.log("myforex",$scope.myforex)
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
        $scope.is_in_watchlist = false

        $scope.data_to_send ={
            data: { symbol:$scope.myforex.pair,
                type:"FOREX"
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
        $('.v-modal').slideDown();
    }

});

var dvChart_forex= document.getElementById('dvChart_forex');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart_forex, ['forexApp']);
});
