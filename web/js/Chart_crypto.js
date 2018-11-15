var ChartApp = angular.module('chartApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
})

ChartApp.controller('ChartController', function ($scope) {

    $scope.from;
    $scope.to;
    $scope.setExchange;

    $scope.current_room = $scope.from + "_" + $scope.to

    $scope.sentiment;
    $scope.name;
    $scope.img;

    ///////////////////////////////////////// SOCKET ///////////////////////////////////////////
    $scope.previous_price = 0;

    $scope.socket = io.connect("https://crypto.tradingcompare.com/");
    $scope.socket.on('connect', () => {
        $scope.socket.emit('room', $scope.current_room);
    })

    $scope.socket.on('message', data => {

        //console.log("data******", data, data.price);
        $scope.mycrypto = data

        if ($scope.previous_price != 0) {
            if ($scope.previous_price > data.price) {
                $scope.mycrypto.variation = "down"
                jQuery("cq-current-price").text(data.price).removeClass('positive')
                    .addClass('negative')
            }
            else if ($scope.previous_price < data.price) {
                $scope.mycrypto.variation = "up"
                jQuery("cq-current-price").text(data.price).removeClass('negative')
                    .addClass('positive')
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

        $scope.previous_price = data.price

        $scope.mycrypto.name = $scope.name
        $scope.mycrypto.img = $scope.img
        $scope.mycrypto.sentiment = $scope.sentiment

        $scope.$apply()
    })
    ///////////////////////////////////////// SOCKET ///////////////////////////////////////////

    $scope.init = function (currency, from, to, crypto_api, name) {
        $scope.from = from
        $scope.to = to

        $scope.Exchanges = fillExchange()
        $scope.setExchange = "General Chart"

        $.ajax({
            // url: 'https://crypto.tradingcompare.com/AllPairsByExchange/' + from + "_" + to + '/' + $scope.setExchange,
            url: crypto_api + "/" + from + "_" + to,
            type: "GET",
            success: function (result) {
                $scope.mycrypto = result
                console.log("after",  $scope.mycrypto)

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

                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        //////// FUNCTIONS //////////
        function fillExchange() {
            var arr = httpGet('https://crypto.tradingcompare.com/' + from + "/" + to)
            var Exchange_list = JSON.parse(arr)
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
    // End Init

////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.changedValue = function () {
        console.log("I changed my exchange", $scope.setExchange)
        let url
        if($scope.setExchange == null){
            url = "https://crypto.tradingcompare.com/AllPairs/" + $scope.from + "_" + $scope.to
            console.log("$scope.setExchange",$scope.setExchange)
            $scope.temp = ""
        }
        else{
            url = 'https://crypto.tradingcompare.com/AllPairsByExchange/' + $scope.from + "_" + $scope.to + "/" + $scope.setExchange;
            $scope.temp = '_' + $scope.setExchange
        }

        var result = httpGet(url)
        result = JSON.parse(result)
        console.log("result from changeExchange", result)
        $scope.mycrypto = result

        //SENTIMENT
        var sent = ($scope.mycrypto.likes / ($scope.mycrypto.likes + $scope.mycrypto.unlikes)) * 100
        $scope.mycrypto.sentiment = Number(sent.toFixed(1))
        $scope.sentiment = Number(sent.toFixed(1))

        //WEBSOCKET
        $scope.socket.emit("leave_room", $scope.current_room);
        console.log("leave",$scope.current_room)

        $scope.current_room = $scope.from + "_" + $scope.to + $scope.temp

        $scope.previous_price = 0;
        $scope.socket.emit("room",$scope.current_room );
        console.log("connect",$scope.current_room)

        // CHART INFO
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
