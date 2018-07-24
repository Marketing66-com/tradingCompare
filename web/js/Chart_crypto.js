var ChartApp = angular.module('chartApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

ChartApp.controller('ChartController', function($scope) {

    $scope.allcrypto = []
    $scope.alllikes = {}
    $scope.element={}

    $scope.init = function (api, from, to, likes) {
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
        console.log("likes",likes)
        $.ajax({
            url: likes,
            type: "GET",
            success: function (result) {
                $scope.alllikes = result
                for (const key in $scope.alllikes) {
                    $scope.element[$scope.alllikes[key].symbol]= $scope.alllikes[key]
                    var sent=($scope.element[$scope.alllikes[key].symbol].likes/($scope.element[$scope.alllikes[key].symbol].likes+$scope.element[$scope.alllikes[key].symbol].unlikes))*100
                    // console.log("Response*likes*", sent)
                    $scope.element[$scope.alllikes[key].symbol].sentiment=Number(sent.toFixed(1))

                }
                for (const key in $scope.element) {

                    if ($scope.element[key].symbol == from && $scope.element[key].toSymbol == to) {
                        $scope.allimg = $scope.element[key]
                    }

                }
                console.log("Response*likes*", $scope.allimg)

                $scope.$apply()


            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        // $.ajax({
        //     url: 'https://afternoon-mountain-15657.herokuapp.com/All-Coins-Aviho',
        //     type: "GET",
        //     success: function (result) {
        //         $scope.list = result
        //         for (i = 0; i < result.length; i++) {
        //             if (result[i].FROMSYMBOL == from) {
        //                 $scope.myname = result[i].name
        //                 console.log("api************found", from, to, $scope.myname )
        //             }
        //         }
        //         $scope.$apply()
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         console.log("ERROR", thrownError, xhr, ajaxOptions)
        //     }
        // });
        //
        // $.ajax({
        // url: img,
        //     type: "GET",
        //     success: function (result) {
        //     $scope.allimg1 = result
        //     $scope.allimg=$scope.allimg1[0]
        //     console.log("IMAGE", $scope.allimg)
        //     $scope.$apply()
        // },
        // error: function (xhr, ajaxOptions, thrownError) {
        //     console.log("ERROR", thrownError, xhr, ajaxOptions)
        // }
    // });



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