var CryptoApp = angular.module('CryptoApp', ['ui.bootstrap']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

CryptoApp.controller('ListController', function($scope,$window){

    let itemsDetails = [];
    $scope.maxSize = 5;

    $scope.currentPage = 1;
    $scope.totalItems = function () {
        return itemsDetails.length;
    };
    $scope.itemsPerPage = 100;

    $scope.result = [];
    $scope.allimg = [];
    $scope.image = {};
    $scope.element = {};

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.filteredItems = itemsDetails.slice(begin, end);
        $(document).scrollTop(0);
    };

    $scope.init = function (crypto_api) {
        this.items = itemsDetails;

        // currencies
        $.ajax({
            url: crypto_api,
            type: "GET",
            success: function (result) {
                $scope.result = result;
                //console.log("$scope.result",$scope.result)

                var i = 0
                for (const key in $scope.result) {
                    if ($scope.result.hasOwnProperty(key)) {

                        itemsDetails[i] = $scope.result[key];

                        //NAME
                        if(itemsDetails[i].name.substr(itemsDetails[i].name.length - 1) == ' ')
                            itemsDetails[i].name = itemsDetails[i].name.substring(0, itemsDetails[i].name.length - 1);
                        itemsDetails[i].complete_name = itemsDetails[i].name
                        if (itemsDetails[i].name.length >=17)
                            itemsDetails[i].name = itemsDetails[i].name.substr(0, 17);

                        //IMAGE
                        if($scope.result[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
                            $scope.result[key].img == undefined
                            || typeof $scope.result[key].img== "undefined"){

                            itemsDetails[i].img = "/img/crypto_logos/crypto-other.png"
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
    }

    $scope.getDisplayValue = function(currentValue)
    {
        return intFormat(currentValue);
    }

    $scope.ActiveChange = function (symbol, name) {

        console.log("activechange", symbol, name)

        if(name.indexOf(' ') > -1)
            name = name.replace(/ /g, '-')

        var url =  decodeURIComponent(Routing.generate('crypto_chart',{"currency" :symbol, "name" :name}))
        console.log(Routing.generate('crypto_chart',{"currency" : symbol, "name" :name}))
        $window.location= url
        return url
    }

    //////////////////////////////////////////////////////////////////////////
    var socket = io.connect("https://crypto.tradingcompare.com/")
    socket.on('connect', function () {
        socket.emit('room', "all_regulated_by_average");
        socket.on('message', data => {
            //console.log("data all regulated", data)
            for (const key in data) {
                var item73 = itemsDetails.find(function (element) {
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
        })
    })

});


var dvCrypto = document.getElementById('dvCrypto');
angular.element(document).ready(function() {
    angular.bootstrap(dvCrypto, ['CryptoApp']);
});