var app = angular.module('myApp', ['ui.bootstrap']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

app.controller('ListController', function($scope){

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
                console.log("$scope.result",$scope.result)

                var i = 0
                for (const key in $scope.result) {
                    if ($scope.result.hasOwnProperty(key)) {
                        itemsDetails[i] = $scope.result[key];
                        if($scope.result[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"|| $scope.result[key].img == undefined || typeof $scope.result[key].img== "undefined")
                            itemsDetails[i].img = "/img/crypto_logos/crypto-other.png"
                        var sent=($scope.result[key].likes / ($scope.result[key].likes + $scope.result[key].unlikes)) *100
                        itemsDetails[i].sentiment=Number(sent.toFixed(1))
                        i = i+1;
                    }
                }

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

        //console.log("activechange", symbol, country, name)

        if(name.indexOf(' ') > -1)
            name = name.replace(/ /g, '-')

        var url =  Routing.generate('crypto_chart',{"currency" :symbol, "name" :name})
        console.log(Routing.generate('crypto_chart',{"currency" :symbol, "name" :name}))
        window.location.href= url
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









// var app = angular.module('myApp', ['ui.bootstrap']).config(function ($interpolateProvider) {
//     $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});
//
// app.controller('ListController', function($scope, $log){
//
//     ///////////////////////////////////////////////////////////////////////
//     $scope.curPage = 1;
//     $scope.itemsPerPage = 100,
//     $scope.maxSize = 5;
//
//     $scope.result = {}
//     $scope.allimg = []
//     $scope.image = {}
//     $scope.element = {}
//
//     $scope.init = function () {
//         this.items = itemsDetails;
//
//         // currencies
//         $.ajax({
//             url: "https://crypto-ws.herokuapp.com/All-Froms-and-Prices",
//             type: "GET",
//             success: function (result) {
//                 $scope.result = result
//                 console.log("$scope.result ",$scope.result )
//                 for (i=0; i< $scope.result.length;i++)
//                 {
//                     itemsDetails[i] = $scope.result[i]
//                 }
//
//                 var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
//                     end = begin + $scope.itemsPerPage;
//
//                 $scope.filteredItems = itemsDetails.slice(begin, end);
//                 $scope.$apply()
//             },
//             error: function (xhr, ajaxOptions, thrownError) {
//                 console.log("ERROR", thrownError, xhr, ajaxOptions)
//             }
//         });
//
//         // images
//         $.ajax({
//             url: 'https://xosignals.herokuapp.com/api2/getTradingCompareByName/crypto',
//             type: "GET",
//             success: function (result) {
//                 $scope.image = result
//                 for (const key in $scope.image) {
//                     $scope.allimg[$scope.image[key].symbol] = {img: $scope.image[key].img }
//
//                     $scope.element[$scope.image[key].symbol]= $scope.image[key]
//                     var sent=($scope.element[$scope.image[key].symbol].likes/($scope.element[$scope.image[key].symbol].likes+$scope.element[$scope.image[key].symbol].unlikes))*100
//                     $scope.element[$scope.image[key].symbol].sentiment=Number(sent.toFixed(1))
//
//                 }
//                 $scope.allimg=$scope.element
//                 console.log("Response*likes*", $scope.allimg)
//                 $scope.$apply()
//             },
//             error: function (xhr, ajaxOptions, thrownError) {
//                 console.log("ERROR", thrownError, xhr, ajaxOptions)
//             }
//         });
//
//     }
//
//     var itemsDetails = []
//
//     $scope.numOfPages = function () {
//         return Math.ceil(itemsDetails.length / $scope.itemsPerPage);
//     };
//     $scope.$watch('curPage + numPerPage', function() {
//         var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
//             end = begin + $scope.itemsPerPage;
//
//         $scope.filteredItems = itemsDetails.slice(begin, end);
//     });
//
//     $scope.getDisplayValue = function(currentValue)
//     {
//         return intFormat(currentValue);
//     }
//
//     $scope.ActiveChange = function (symbol) {
//         var sym= symbol.split("/")
//         var url =  Routing.generate('crypto_chart',{"currency" :sym})
//         window.location.href= url
//         return url
//     }
//
//
//     var socket = io.connect('http://www.evisbregu.com:8002');
//
//     socket.on('connect', function () {
//         socket.emit('room', "all_regulated_by_average");
//         socket.on('message', data => {
//             //console.log("data all regulated", data)
//             for (const key in data) {
//                 var item73 = $scope.result.find(function (element) {
//                     return ((element.fromSymbol == key.split("_",1))&&(element.toSymbol == key.split("_")[1]));
//                 })
//                 if (typeof item73 != typeof undefined) {
//                     for (const ky in data[key]) {
//                         if (data.hasOwnProperty(key)) {
//                             item73[ky] = data[key][ky];
//                         }
//                     }
//                 }
//                 $scope.$apply()
//             }
//         })
//     })
// });
//
