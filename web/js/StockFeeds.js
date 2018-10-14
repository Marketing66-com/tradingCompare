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
    var str = ""

    $scope.onSelect = function ($item, $model, $label) {
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        console.log("$scope.$item",$scope.$item.name,$scope.$model,$scope.$label)

        if($scope.$item.name.indexOf(' ') > -1)
            $scope.$item.name = $scope.$item.name.replace(' ', '-')

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

        // str = ""
        // for(var i = 0; i<= 99; i++)
        // { str =  str + $scope.filteredItems[i].pair + "," }
        // str = str.substring(0, str.length - 1);
        //console.log("str",str)

        $(document).scrollTop(0);
    };
    // *********** end ************


    $scope.init = function (country_name, country_value) {
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
                console.log("$scope.result",$scope.result)

                var j = 0
                for (const key in $scope.result) {
                    if ($scope.result.hasOwnProperty(key)) {

                        itemsDetails[j] = $scope.result[key];

                        //NAME
                        if(itemsDetails[j].name.indexOf(' Corporation') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace(' Corporation', '');
                        if(itemsDetails[j].name.indexOf(' Common') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace(' Common', '');
                        if(itemsDetails[j].name.indexOf(' Stock') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace(' Stock', '');

                        if(itemsDetails[j].name.indexOf(', Inc.') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace(', Inc.', '');
                        if(itemsDetails[j].name.indexOf(' Inc.') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace(' Inc.', '');
                        if(itemsDetails[j].name.indexOf(' Inc') > -1)
                         itemsDetails[j].name = itemsDetails[j].name.replace(' Inc', '');

                        if(itemsDetails[j].name.indexOf('/') > -1)
                            itemsDetails[j].name = itemsDetails[j].name.replace('/', '-');

                        if(itemsDetails[j].name === itemsDetails[j].name.toUpperCase())
                        itemsDetails[j].name = itemsDetails[j].name.charAt(0).toUpperCase() + itemsDetails[j].name.toLowerCase().substring(1, itemsDetails[j].name.length);

                        if (itemsDetails[j].name.length >=17)
                         itemsDetails[j].name = itemsDetails[j].name.substr(0, 17);

                        if(itemsDetails[j].name.substr(itemsDetails[j].name.length - 1) == ' ')
                            itemsDetails[j].name = itemsDetails[j].name.substring(0, itemsDetails[j].name.length - 1);


                        //IMAGE
                        var img = "https://storage.googleapis.com/iex/api/logos/" + key + ".png"
                        if(itemsDetails[j].img == undefined || typeof itemsDetails[j].img == "undefined" || img == undefined || typeof img == "undefined")
                        itemsDetails[j].img = "/img/Stock_Logos/stocks.png"
                        else
                        itemsDetails[j].img = img

                        // SENTIMENT
                        var sent=($scope.result[key].likes / ($scope.result[key].likes + $scope.result[key].unlikes)) *100
                        itemsDetails[j].sentiment=Number(sent.toFixed(1))

                        j = j+1;
                    }
                }
                // str = str.substring(0, str.length - 1)
                console.log("itemsDetails",itemsDetails)

                $scope.totalItems = itemsDetails.length;

                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                    end = begin + $scope.itemsPerPage;

                $scope.filteredItems = itemsDetails.slice(begin, end);
                //console.log("$scope.filteredItems",$scope.filteredItems[0].pair)
                // str = ""
                // for(var i = 0; i<= 99; i++)
                // { str =  str + $scope.filteredItems[i].pair + "," }
                // str = str.substring(0, str.length - 1);
                //console.log("af str", str)

                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });


        ////////////////////////////////////////////////////////

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



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //    STOCK
    // var socketStock = io.connect("https://ws-api.iextrading.com/1.0/last");
    // console.log("socket str", str)
    // socketStock.emit("subscribe", symbol);
    //
    // socketStock.on("message", (data) => {
    //     data = JSON.parse(data);
    //     //console.log("data", data)
    //     $scope.mystock.price = data.price
    //     $scope.mystock.change24 = (((data.price - $scope.mystock.price_open) / $scope.mystock.price_open) * 100).toFixed(2)
    //     $scope.mystock.point = ($scope.mystock.price_open - data.price).toFixed(2)
    //
    //     $scope.$apply()
    //
    // })

}

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

    /////////////////////////////////////////////////////////////////////////////

    $scope.ActiveChange = function (symbol, country, name) {

        if(name.indexOf(' ') > -1)
         name = name.replace(/ /g, '-')

        var url =  Routing.generate('stock_chart',{"symbol" :symbol, "country":country, "name":name })
        console.log(Routing.generate('stock_chart',{"symbol" :symbol, "country":country, "name":name }))
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

