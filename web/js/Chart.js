var ChartApp = angular.module('chartApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

ChartApp.controller('ChartController', function($scope) {

    $scope.allcrypto = []
    $scope.list = []

    $scope.init = function (api, from, to) {
        console.log("api**************////////////**************", api)

        // var array = httpGet('https://afternoon-mountain-15657.herokuapp.com/All-Coins-Aviho')
        // var list = JSON.parse(array)
        // var obj = list.find(o => o.FROMSYMBOL == curr)
        // return obj.name


        $.ajax({
            url: api,
            type: "GET",
            success: function (result) {
                $scope.allcrypto = result
                for (i = 0; i < result.length; i++) {
                    if (result[i].fromSymbol == from && result[i].toSymbol == to) {
                        $scope.mycrypto = result[i]
                        console.log("api************found", from, to,$scope.mycrypto )
                    }
                }
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        $.ajax({
            url: 'https://afternoon-mountain-15657.herokuapp.com/All-Coins-Aviho',
            type: "GET",
            success: function (result) {
                $scope.list = result
                for (i = 0; i < result.length; i++) {
                    if (result[i].FROMSYMBOL == from) {
                        $scope.myname = result[i].name
                        console.log("api************found", from, to, $scope.myname )
                    }
                }
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });


    }


    /////////////////////////////////////////////////////////////////////////////////////////////////
    var socket = io.connect("https://crypto-ws.herokuapp.com")

    socket.on('connect', function () {
        socket.emit('room', "all_regulated");
        socket.on('message', data => {
            for (const key in data) {
            var item73 = $scope.allcrypto.find(function (element) {

                return ((element.fromSymbol == key.split("_",1))&&(element.toSymbol == key.split("_")[1]));

            })
            // console.log("item73", item73)
            if (typeof item73 != typeof undefined) {
                for (const ky in data[key]) {
                    if (data.hasOwnProperty(key)) {
                        item73[ky] = data[key][ky];

                    }
                }

            }
            $scope.$apply()
        }
        //
    })
    })

    $scope.getDisplayValue = function(currentValue)
    {
        return intFormat(currentValue);
    }


    $scope.ActiveChange = function (symbol) {

        // var from = symbol.split("/",1)
        // var to = symbol.split("/",2)
        var sym= symbol.split("/")
        // console.log(from[0], to[1], '*********************')
        var url =  Routing.generate('crypto_chart',{"currency" :sym})
        console.log(Routing.generate('crypto_chart',{"currency" :sym}))
        window.location.href= url
        //  console.log("----", Routing.generate('crypto_chart', from, to, true))
        return url
        // console.log("----",Routing.generate('crypto_chart'))

    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////

});

var dvChart = document.getElementById('dvChart');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart, ['chartApp']);
});