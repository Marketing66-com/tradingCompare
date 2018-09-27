var app = angular.module('myApp', ['ui.bootstrap']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

app.controller('ListController', function($scope){

    $scope.curPage = 1;
    $scope.itemsPerPage = 100,
    $scope.maxSize = 5;

    $scope.result = {}
    $scope.allimg = []
    $scope.image = {}
    $scope.element = {}

    $scope.init = function () {
        this.items = itemsDetails;

        // currencies
        $.ajax({
            url: "https://crypto-ws.herokuapp.com/All-Froms-and-Prices",
            type: "GET",
            success: function (result) {
                $scope.result = result
                console.log("$scope.result ",$scope.result )
                for (i=0; i< $scope.result.length;i++)
                {
                    itemsDetails[i] = $scope.result[i]
                }

                var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
                    end = begin + $scope.itemsPerPage;

                $scope.filteredItems = itemsDetails.slice(begin, end);
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        // images
        $.ajax({
            url: 'https://xosignals.herokuapp.com/api2/getTradingCompareByName/crypto',
            type: "GET",
            success: function (result) {
                $scope.image = result
                for (const key in $scope.image) {
                    $scope.allimg[$scope.image[key].symbol] = {img: $scope.image[key].img }

                    $scope.element[$scope.image[key].symbol]= $scope.image[key]
                    var sent=($scope.element[$scope.image[key].symbol].likes/($scope.element[$scope.image[key].symbol].likes+$scope.element[$scope.image[key].symbol].unlikes))*100
                    $scope.element[$scope.image[key].symbol].sentiment=Number(sent.toFixed(1))

                }
                $scope.allimg=$scope.element
                console.log("Response*likes*", $scope.allimg)
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

    }

    var itemsDetails = []

    $scope.numOfPages = function () {
        return Math.ceil(itemsDetails.length / $scope.itemsPerPage);
    };
    $scope.$watch('curPage + numPerPage', function() {
        var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.filteredItems = itemsDetails.slice(begin, end);
    });

    $scope.getDisplayValue = function(currentValue)
    {
        return intFormat(currentValue);
    }

    $scope.ActiveChange = function (symbol) {
        var sym= symbol.split("/")
        var url =  Routing.generate('crypto_chart',{"currency" :sym})
        window.location.href= url
        return url
    }


    var socket = io.connect('http://www.evisbregu.com:8002');

    socket.on('connect', function () {
        socket.emit('room', "all_regulated_by_average");
        socket.on('message', data => {
            //console.log("data all regulated", data)
            for (const key in data) {
                var item73 = $scope.result.find(function (element) {
                    return ((element.fromSymbol == key.split("_",1))&&(element.toSymbol == key.split("_")[1]));
                })
                if (typeof item73 != typeof undefined) {
                    for (const ky in data[key]) {
                        if (data.hasOwnProperty(key)) {
                            item73[ky] = data[key][ky];
                        }
                    }
                }
                $scope.$apply()
            }
        })
    })
});

