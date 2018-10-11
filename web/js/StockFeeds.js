// var stockApp = angular.module('stockApp', []).config(function ($interpolateProvider) {
//     $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

var stockApp = angular.module('stockApp', ['ui.bootstrap']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

stockApp.controller("stockController", function ($scope) {

    // *********** variables for ajax & country ************
    $scope.listCountry = [];
    $scope.country_name;
    $scope.country_value;
    // str = "", str2 = "", str3 = "", str4 = "", str5 = ""

    $scope.result = []
    $scope.country =[]

    $scope.onSelect = function ($item, $model, $label) {
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        console.log("$scope.$item",$scope.$item.name,$scope.$model,$scope.$label)

        var url =  Routing.generate('Live_rates_stocks',{"name" :$scope.$item.name, "value":$scope.$item.value})
        console.log("Routing",Routing.generate('Live_rates_stocks',{"name" :$scope.$item.name, "value":$scope.$item.value}))
        window.location.href= url

    };

    // *********** variables for pagination ************
    let itemsDetails = [];
    $scope.maxSize = 5;

    $scope.currentPage = 1;
    $scope.totalItems = function () {
        return itemsDetails.length;
    };
    $scope.itemsPerPage = 100;

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.filteredItems = itemsDetails.slice(begin, end);
        $(document).scrollTop(0);
    };
    // *********** end ************


    $scope.init = function (stocks_api, chart_link, stocks_likes, country_name, country_value) {
       // console.log("api", stocks_api, chart_link, stocks_likes,country_name, country_value)

        this.items = itemsDetails;
        $scope.country_name = country_name;
        $scope.country_value = country_value;

        // *********************************


        // all product
        $.ajax({
            url: "https://websocket-stock.herokuapp.com/stocks/" + country_value,
            type: "GET",
            success: function (result) {
                $scope.result = result;
                //console.log("$scope.result",$scope.result)

                var j = 0
                for (const key in $scope.result) {
                    if ($scope.result.hasOwnProperty(key)) {

                        itemsDetails[j] = $scope.result[key];

                        if(itemsDetails[j].name.indexOf('Corporation') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace('Corporation', '');
                        if(itemsDetails[j].name.indexOf('Common') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace('Common', '');
                        if(itemsDetails[j].name.indexOf('Stock') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace('Stock', '');

                        if(itemsDetails[j].name.indexOf(', Inc.') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace(', Inc.', '');
                        if(itemsDetails[j].name.indexOf('Inc.') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace('Inc.', '');
                        if(itemsDetails[j].name.indexOf('Inc') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace('Inc', '');

                        if(itemsDetails[j].name === itemsDetails[j].name.toUpperCase())
                        itemsDetails[j].name = itemsDetails[j].name.charAt(0).toUpperCase() + itemsDetails[j].name.toLowerCase().substring(1, itemsDetails[j].name.length);

                        if (itemsDetails[j].name.length >=17)
                         itemsDetails[j].name = itemsDetails[j].name.substr(0, 17);

                        itemsDetails[j].img = "https://storage.googleapis.com/iex/api/logos/" + key + ".png"
                        if(itemsDetails[j].img == undefined || typeof itemsDetails[j].img == "undefined")
                            itemsDetails[j].img = "/img/Stock_Logos/stocks.png"

                        // if($scope.result[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/stocks.png"|| $scope.result[key].img == undefined || typeof $scope.result[key].img== "undefined")
                        //     itemsDetails[j].img = "/img/Stock_Logos/stocks.png"

                        var sent=($scope.result[key].likes / ($scope.result[key].likes + $scope.result[key].unlikes)) *100
                        itemsDetails[j].sentiment=Number(sent.toFixed(1))

                        // if(j<1000) { str = str + key + ",";}
                        // if(j>=1000 && j<2000) { str2 = str2 + key + ",";}
                        // if(j>=2000 && j<3000) { str3 = str3 + key + ",";}
                        // if(j>=3000 && j<4000) { str4 = str4 + key + ",";}
                        // if(j>=4000 && j<=5000) { str5 = str5 + key + ",";}
                        j = j+1;
                    }
                }
                // str = str.substring(0, str.length - 1)
                //console.log("itemsDetails",itemsDetails)

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

        ////////////////////////////////////////////////////////

        // likes
        // $.ajax({
        //     url: stocks_likes,
        //     type: "GET",
        //     success: function (result) {
        //         $scope.alllikes = result
        //         for (const key in $scope.alllikes) {
        //             $scope.element[$scope.alllikes[key].symbol] = $scope.alllikes[key]
        //             var sent = ($scope.element[$scope.alllikes[key].symbol].likes / ($scope.element[$scope.alllikes[key].symbol].likes + $scope.element[$scope.alllikes[key].symbol].unlikes)) * 100
        //             // console.log("Response*likes*", sent)
        //             $scope.element[$scope.alllikes[key].symbol].sentiment = Number(sent.toFixed(1))
        //         }
        //         $scope.allimg = $scope.element
        //         //console.log("Response*likes*", $scope.allimg)
        //         $scope.$apply()
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         console.log("ERROR", thrownError, xhr, ajaxOptions)
        //     }
        // })

        // country
        $.ajax({
            url: "https://websocket-stock.herokuapp.com/ListOfCountry",
            type: "GET",
            success: function (result) {
                $scope.country = result
                //console.log("$scope.country",$scope.country)
                for (var k = 0; k < $scope.country[0].length; k++) {

                    var obj = {
                        name: $scope.country[1][k],
                        value: $scope.country[0][k]
                    }
                    $scope.listCountry.push(obj)
                }
                //console.log("listCountry", $scope.listCountry)
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        })
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     setTimeout(function(){
//         var socketStock = io.connect("https://ws-api.iextrading.com/1.0/last");
//         //console.log("str",str)
//         socketStock.emit("subscribe", str);
//         socketStock.emit("subscribe", str2);
//         // socketStock.emit("subscribe", str3);
//         // socketStock.emit("subscribe", str4);
//         // socketStock.emit("subscribe", str5);
//
//         socketStock.on("message", (data) => {
//             data = JSON.parse(data);
//             //console.log("data",data)
//
//         // for (const key in data) {
//             var item73 = itemsDetails.find(function (element) {
//                 return (element.fromSymbol == data.symbol);
//             })
//             if (typeof item73 != typeof undefined) {
//                 for (const ky in data[key]) {
//                     if (data.hasOwnProperty(key)) {
//                         item73['price'] = data['price'];
//                     }
//                 }
//             }
//             $scope.$apply()
//         // }
//
//         })
//     }, 3000);


    // var socket = io.connect("https://websocket-stock.herokuapp.com")
    //     socket.on('connect', function () {
    //     socket.emit('room', "stockSocket");
    //     socket.on('message', data => {
    //         console.log("stock socket response", data)
    //         for (const key in data) {
    //             var item73 = $scope.all.find(function (element) {
    //                 return (element.name == data[key].name);
    //             })
    //             if (typeof item73 != typeof undefined) {
    //                 for (const ky in data[key]) {
    //                     if (data.hasOwnProperty(key)) {
    //                         item73[ky] = data[key][ky];
    //                     }
    //                 }
    //             }
    //             $scope.$apply()
    //         }
    //     })
    // })


    $scope.ActiveChange = function (symbol) {

        var url =  Routing.generate('stock_chart',{"currency" :symbol})
        //console.log(Routing.generate('stock_chart',{"currency" :symbol}))
        window.location.href= url
        return url
    }

});

// var dvstock = document.getElementById('dvstock');
//
// angular.element(document).ready(function() {
//
//     angular.bootstrap(dvstock, ['stockApp']);
// });

