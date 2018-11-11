var ChartApp = angular.module('chartApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

ChartApp.controller('ChartController', function($scope) {

    $scope.from ;
    $scope.to ;
    $scope.setExchange;

    $scope.current_room;

    $scope.sentiment;
    $scope.name;
    $scope.img;

    $scope.socket = io.connect("https://crypto.tradingcompare.com/")
    // $scope.names = ["Emil", "Tobias", "Linus"];

    $scope.init = function (currency, from, to, crypto_api, name) {
        $scope.from = from
        $scope.to = to

        $scope.Exchanges = fillExchange()
        $scope.setExchange =  $scope.Exchanges[0]

        $.ajax({
            url: 'https://crypto.tradingcompare.com/AllPairsByExchange/'+ from + "_" + to + '/' + $scope.setExchange,
            type: "GET",
            success: function (result) {
                $scope.mycrypto = result
                //console.log("after",  $scope.mycrypto)

                // IMAGE
                if($scope.mycrypto.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"|| $scope.mycrypto.img == undefined || typeof $scope.mycrypto.img== "undefined")
                    $scope.mycrypto.img = "/img/crypto_logos/crypto-other.png"

                //SENTIMENT
                var sent=($scope.mycrypto.likes / ($scope.mycrypto.likes + $scope.mycrypto.unlikes)) *100
                $scope.mycrypto.sentiment = Number(sent.toFixed(1))

                $scope.sentiment = Number(sent.toFixed(1))
                $scope.name = $scope.mycrypto.name
                $scope.img = $scope.mycrypto.img

                fill_Chart_Change_Price($scope.mycrypto)

                $scope.connect(from + "_" + to + '_' + $scope.setExchange)

                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });


        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        // $.ajax({
        //     url: crypto_api + "/" + from + "_" + to,
        //     type: "GET",
        //     success: function (result) {
        //         console.log("result", result)
        //         $scope.mycrypto = result[from + "_" + to]
        //         //console.log("after",  result[from.toUpperCase() + "_" + to.toUpperCase()], from, to)
        //
        //         console.log("after",  $scope.mycrypto)
        //
        //         // IMAGE
        //         if($scope.mycrypto.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"|| $scope.mycrypto.img == undefined || typeof $scope.mycrypto.img== "undefined")
        //             $scope.mycrypto.img = "/img/crypto_logos/crypto-other.png"
        //
        //         //SENTIMENT
        //         var sent=($scope.mycrypto.likes / ($scope.mycrypto.likes + $scope.mycrypto.unlikes)) *100
        //         $scope.mycrypto.sentiment = Number(sent.toFixed(1))
        //
        //         $scope.sentiment = Number(sent.toFixed(1))
        //         $scope.name = $scope.mycrypto.name
        //         $scope.img = $scope.mycrypto.img
        //
        //         $scope.$apply()
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         console.log("ERROR", thrownError, xhr, ajaxOptions)
        //     }
        // });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        function fillExchange() {
            var arr = httpGet('https://crypto.tradingcompare.com/' + from + "/" +  to)
            var Exchange_list = JSON.parse(arr)
            if(Exchange_list.indexOf('BITSTAMP') > -1){
                var index = Exchange_list.indexOf('BITSTAMP')
                Exchange_list[index] = Exchange_list[0]
                Exchange_list[0] = 'BITSTAMP'
            }
            return Exchange_list
        }

        function fill_Chart_Change_Price(object){
            if (object.change24 > 0) {
                jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
                    .format(object.change24) + "%")
                        .addClass('positive').css({ 'font-size':15 });
            } else {
                jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
                    .format(object.change24) + "%")
                        .addClass('negative').css({ 'font-size':15 });
            }
            jQuery("cq-current-price").text(object.price);
        }
    }

/////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.connect = function(room) {
        console.log("in connect")

        $scope.socket.on('connect', function () {

            if($scope.current_room == undefined){
                console.log("if")
                // $scope.current_room = $scope.from + "_" + $scope.to + "_" + $scope.setExchange
                $scope.current_room = room
            }
            else{
                console.log("else",$scope.current_room)
                $scope.socket.emit("leave_room", $scope.current_room)
                // $scope.current_room = $scope.from + "_" + $scope.to + "_" + $scope.setExchange
                $scope.current_room = room
            }

            // room = $scope.from + "_" + $scope.to + "_" + $scope.setExchange
            console.log("room1",room)
            var previous_price = 0

            $scope.socket.emit('room',  room);

            $scope.socket.on('message', data => {

                console.log("data1******",  $scope.setExchange, data.price)
                $scope.mycrypto = data

                if (previous_price != 0) {
                    if (previous_price > data.price) {
                        $scope.mycrypto.variation = "down"
                        // console.log("down")
                        // jQuery("cq-current-price").text(data.price).css({ 'color':red })
                    }
                    else if (previous_price < data.price) {
                        $scope.mycrypto.variation = "up"
                        // console.log("up")
                        // jQuery("cq-current-price").text(data.price).css({ 'color':'#7ED400' })
                    }
                }
                if (data.change24 > 0) {
                    jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
                        .format(data.change24) + "%")
                        .addClass('positive').css({'font-size': 15});
                } else {
                    jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
                        .format(data.change24) + "%")
                        .addClass('negative').css({'font-size': 15});
                }
                jQuery("cq-current-price").text(data.price)

                previous_price = data.price

                $scope.mycrypto.name = $scope.name
                $scope.mycrypto.img = $scope.img
                $scope.mycrypto.sentiment = $scope.sentiment

                // setTimeout(()=>{
                // $scope.socket.emit("leave_room", room)
                // },20000)

                $scope.$apply()
            })
        })
    }

    // function disconnect(){
    //
    //     var leave_room = $scope.room
    //     console.log("leave_room",leave_room)
    //
    //
    // }

    $scope.changedValue = function(){
        console.log("I changed my exchange",$scope.setExchange)

        var url = 'https://crypto.tradingcompare.com/AllPairsByExchange/'+ $scope.from + "_" + $scope.to + '/' + $scope.setExchange;
        var result = httpGet(url)
        result = JSON.parse(result)
        console.log("result from changeExchange", result)
        $scope.mycrypto =  result

        var sent=($scope.mycrypto.likes / ($scope.mycrypto.likes + $scope.mycrypto.unlikes)) *100
        $scope.mycrypto.sentiment = Number(sent.toFixed(1))

        $scope.sentiment = Number(sent.toFixed(1))

        //$scope.socket.emit("leave_room", $scope.room)
        var params =  $scope.from + "_" + $scope.to + "_" +$scope.setExchange
        $scope.socket.emit("leave_room", $scope.room);
        $scope.room = params;
        $scope.socket.emit("room", $scope.room);

        console.log(params)
        //connect(params)

    }
     
    $scope.getDisplayValue = function(currentValue)
    {
        return intFormat(currentValue);
    }

});



var dvChart = document.getElementById('dvChart');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart, ['chartApp']);
});


function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
