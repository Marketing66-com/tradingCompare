var ForexApp = angular.module('ForexApp', ['ui.bootstrap']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

ForexApp.controller("ForexController", function ($scope, $http,$window) {

    let itemsDetails = [];
    $scope.maxSize = 5;

    $scope.currentPage = 1;
    $scope.totalItems = function () {
        return itemsDetails.length;
    };
    $scope.itemsPerPage = 100;

    $scope.result = [];

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.filteredItems = itemsDetails.slice(begin, end);
        $(document).scrollTop(0);
    };

    $scope.init = function () {
        this.items = itemsDetails;

        // currencies
        $.ajax({
            url: "https://forex.tradingcompare.com/all_data",
            type: "GET",
            success: function (result) {
                $scope.result = result;
                //console.log("$scope.result",$scope.result)

                var i = 0
                for (const key in $scope.result) {
                    if ($scope.result.hasOwnProperty(key)) {

                        itemsDetails[i] = $scope.result[key];

                        //NAME
                        itemsDetails[i].complete_name = itemsDetails[i].name

                        //IMAGE
                        if($scope.result[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
                            $scope.result[key].img == undefined
                            || typeof $scope.result[key].img== "undefined"){

                            itemsDetails[i].img =  "/img/Stock_Logos/stocks.png"
                        }

                        //SENTIMENT
                        var sent=($scope.result[key].likes / ($scope.result[key].likes + $scope.result[key].unlikes)) *100
                        itemsDetails[i].sentiment=Number(sent.toFixed(1))

                        i = i+1;
                    }
                }
                console.log("itemsDetails",itemsDetails)
                $scope.totalItems = itemsDetails.length;

                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                    end = begin + $scope.itemsPerPage;

                $scope.filteredItems = itemsDetails.slice(begin, end);
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });
        $scope.getDisplayValue = function(currentValue)
        {
            return intFormat(currentValue);
        }
    }

    ///////////////////////////////////////// SOCKET ///////////////////////////////////////////
    $scope.socket = io.connect('https://forex.tradingcompare.com');
    $scope.socket.on('connect', () => {
        $scope.socket.emit('room', 'all_pairs');
    })
    $scope.socket.on('message', data => {
        //console.log("data******", data);
        for (const key in data) {

            var item73 = itemsDetails.find(function (element) {
                //console.log("1",key.split("_",1),"2",key.split("_")[1],"2",element.fromSymbol,"4",element.toSymbol)
                return ((element.fromSymbol == key.split("_",1))&&(element.toSymbol == key.split("_")[1]));
                return ((element.pair == key.pair));
            })
             //console.log("item73", item73)
            if (typeof item73 != typeof undefined) {
                for (const ky in data[key]) {
                    if (data.hasOwnProperty(key)) {
                        item73[ky] = data[key][ky];
                    }
                }
            }
            $scope.$apply()
        }
        // $scope.myforex = data

        // $scope.myforex.name = $scope.name
        // $scope.myforex.img = $scope.img
        // $scope.myforex.sentiment = $scope.sentiment

        $scope.$apply()
    })
        // var socket = io.connect("https://forex-websocket.herokuapp.com/", {
        //     path: "/socket/forex/livefeed"
        // })
        // socket.on('connect', function () {
        //     socket.emit('room', "all_pairs");
        //     socket.on('message', response => {
        //         var item73
        //
        //         for (key in response) {
        //         item73 = $scope.all.find(function (element) {
        //
        //             return element.fromSymbol == (response[key].fromSymbol.slice(0, 3) + "/" + response[key].fromSymbol.slice(3, 6));
        //         });
        //
        //
        //         if (typeof item73 != typeof undefined) {
        //             // console.log("---",item73)
        //             for (const property in response[key]) {
        //
        //
        //                 if (response[key].hasOwnProperty(property) && property != "fromSymbol") {
        //                     item73[property] = response[key][property];
        //                     // console.log(item73[key])
        //                 }
        //             }
        //         }
        //     }
        //     $scope.$apply()
        //
        // })
        // })

        $scope.ActiveChange = function (symbol) {

            var from = symbol.slice(0, 3)
            var to = symbol.slice(3, 6)
            symbol = from + "-" + to

             var url =  Routing.generate('forex_chart',{"currency" :symbol})
            console.log(Routing.generate('forex_chart',{"currency" :symbol}))
            $window.location= url
           return url
        }

    });

    var dvForex = document.getElementById('dvForex');

    angular.element(document).ready(function() {

        angular.bootstrap(dvForex, ['ForexApp']);
    });

