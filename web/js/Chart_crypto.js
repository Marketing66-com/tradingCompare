var ChartApp = angular.module('chartApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
})

ChartApp.controller('ChartController', function ($scope) {

    $scope.from;
    $scope.to;
    $scope.setExchange;

    $scope.current_room = $scope.from + "_" + $scope.to + '_' + 'BITSTAMP';

    $scope.sentiment;
    $scope.name;
    $scope.img;

    $scope.previous_price = 0;

    $scope.socket = io.connect("https://crypto.tradingcompare.com/");

   // $scope.socket.on('connect', () => {
   //    $scope.socket.emit('room', $scope.current_room);
   // })

    $scope.socket.on('message', data => {

        console.log("data******", $scope.setExchange, data.price);
        $scope.mycrypto = data

        if ($scope.previous_price != 0) {
            if ($scope.previous_price > data.price) {
                $scope.mycrypto.variation = "down"
                // console.log("down")
                // jQuery("cq-current-price").text(data.price).css({ 'color':red })
            }
            else if ($scope.previous_price < data.price) {
                $scope.mycrypto.variation = "up"
                // console.log("up")
                // jQuery("cq-current-price").text(data.price).css({ 'color':'#7ED400' })
            }
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
        jQuery("cq-current-price").text(data.price)

        $scope.previous_price = data.price

        $scope.mycrypto.name = $scope.name
        $scope.mycrypto.img = $scope.img
        $scope.mycrypto.sentiment = $scope.sentiment

        // setTimeout(()=>{
        // $scope.socket.emit("leave_room", room)
        // },20000)

        $scope.$apply()
    })


    $scope.init = function (currency, from, to, crypto_api, name) {
        $scope.from = from
        $scope.to = to

        $scope.Exchanges = fillExchange()
        $scope.setExchange = $scope.Exchanges[0]

        $.ajax({
            url: 'https://crypto.tradingcompare.com/AllPairsByExchange/' + from + "_" + to + '/' + $scope.setExchange,
            type: "GET",
            success: function (result) {
                $scope.mycrypto = result
                //console.log("after",  $scope.mycrypto)

                // IMAGE
                if ($scope.mycrypto.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png" || $scope.mycrypto.img == undefined || typeof $scope.mycrypto.img == "undefined")
                    $scope.mycrypto.img = "/img/crypto_logos/crypto-other.png"

                //SENTIMENT
                var sent = ($scope.mycrypto.likes / ($scope.mycrypto.likes + $scope.mycrypto.unlikes)) * 100
                $scope.mycrypto.sentiment = Number(sent.toFixed(1))
                $scope.sentiment = Number(sent.toFixed(1))

                $scope.name = $scope.mycrypto.name
                $scope.img = $scope.mycrypto.img

                fill_Chart_Change_Price($scope.mycrypto)

                $scope.current_room = from + "_" + to + '_' + $scope.setExchange
                //$scope.socket.emit('room', $scope.current_room);
               // console.log("connect init",$scope.current_room)

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
            var arr = httpGet('https://crypto.tradingcompare.com/' + from + "/" + to)
            var Exchange_list = JSON.parse(arr)
            if (Exchange_list.indexOf('BITSTAMP') > -1) {
                var index = Exchange_list.indexOf('BITSTAMP')
                Exchange_list[index] = Exchange_list[0]
                Exchange_list[0] = 'BITSTAMP'
            }
            return Exchange_list
        }

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

////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.changedValue = function () {
        console.log("I changed my exchange", $scope.setExchange)

        var url = 'https://crypto.tradingcompare.com/AllPairsByExchange/' + $scope.from + "_" + $scope.to + '/' + $scope.setExchange;
        var result = httpGet(url)
        result = JSON.parse(result)
        console.log("result from changeExchange", result)
        $scope.mycrypto = result

        //SENTIMENT
        var sent = ($scope.mycrypto.likes / ($scope.mycrypto.likes + $scope.mycrypto.unlikes)) * 100
        $scope.mycrypto.sentiment = Number(sent.toFixed(1))
        $scope.sentiment = Number(sent.toFixed(1))

        $scope.socket.emit("leave_room", $scope.current_room);
        console.log("leave",$scope.current_room)

        $scope.current_room = $scope.from + "_" + $scope.to + '_' + $scope.setExchange

        $scope.previous_price = 0;
        $scope.socket.emit("room",$scope.current_room );
        console.log("connect",$scope.current_room)


        if (result.change24 > 0) {
            jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
                .format(result.change24) + "%").removeClass('negative')
                .addClass('positive').css({'font-size': 15});
        } else if (result.change24 < 0){
            jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
                .format(result.change24) + "%").removeClass('positive')
                .addClass('negative').css({'font-size': 15});
        }
        jQuery("cq-current-price").text(result.price);
        // var params = $scope.from + "_" + $scope.to + "_" + $scope.setExchange
        //
        // $scope.room = params;
        //
        //
        // console.log(params)
        //connect(params)

    }

    $scope.getDisplayValue = function (currentValue) {
        return intFormat(currentValue);
    }

});


var dvChart = document.getElementById('dvChart');

angular.element(document).ready(function () {

    angular.bootstrap(dvChart, ['chartApp']);
});


function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
