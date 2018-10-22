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

    $scope.str = ""
    $scope.socket_object = {}

    $scope.onSelect = function ($item, $model, $label) {
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        console.log("$scope.$item",$scope.$item.name,$scope.$model,$scope.$label)

        if($scope.$item.name.indexOf(' ') > -1)
            $scope.$item.name = $scope.$item.name.replace(' ', '-')

        if($scope.$item.value.indexOf(' ') > -1)
            $scope.$item.value = $scope.$item.value.replace(' ', '-')

        var url =  Routing.generate('Live_rates_stocks',{"name" :$scope.$item.name, "value":$scope.$item.value})
        console.log("Routing",Routing.generate('Live_rates_stocks',{"name" :$scope.$item.name, "value":$scope.$item.value}))
        window.location.href= url

    };

    // $scope.inputFormatter = function($model)
    // {
    //     console.log("$model",$model)
    //     if (!$model) return  $scope.country_name;
    //     return $model.name;
    // }
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

        $scope.str = ""
        for(var i = 0; i<= 99; i++)
        { $scope.str =  $scope.str + $scope.filteredItems[i].pair + "," }
        $scope.str = $scope.str.substring(0, $scope.str.length - 1);
        //console.log("str",$scope.str)
        reconnect();
        $(document).scrollTop(0);
    };
    // *********** end ************


    $scope.init = function (country_name, country_value) {
        //console.log("api", country_name, country_value)

        this.items = itemsDetails;
        $scope.country_name = country_name;
        $scope.country_value = country_value;

        // *********************************

var array =""
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
                        itemsDetails[j].complete_name = itemsDetails[j].name
                        if (itemsDetails[j].name.length >=17)
                            itemsDetails[j].name = itemsDetails[j].name.substr(0, 17);

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
                //console.log("itemsDetails",itemsDetails)
                console.log("array",array)

                $scope.totalItems = itemsDetails.length;

                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                    end = begin + $scope.itemsPerPage;

                $scope.filteredItems = itemsDetails.slice(begin, end);
                //console.log("$scope.filteredItems",$scope.filteredItems)
                $scope.str = ""
                for(var i = 0; i<= 99; i++)
                { $scope.str =  $scope.str + $scope.filteredItems[i].pair + "," }
                $scope.str = $scope.str.substring(0, $scope.str.length - 1);
                //console.log("af str", $scope.str)

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

    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //WEB-SOCKET

    var socketStock;

    let timerId = setInterval(MyInterval, 5000);

    setTimeout(start, 1000);

    function start()
    {
        if($scope.str == "")
        {
            setTimeout(start, 1000);
            console.log("str empty settimeout again")
        }

        else
        {
            console.log("str ok go to connect")
            clearInterval(timerId)
            connect()
            setInterval(MyInterval, 5000)
        }


    }
    function connect(){

        console.log("in connect")
        socketStock = io.connect("https://ws-api.iextrading.com/1.0/last");
        socketStock.emit("subscribe", $scope.str);
        // console.log("in connect $scope.str", $scope.str)
        socketStock.on("message", (data) => {
            data = JSON.parse(data);
            if(data.symbol == "AAPL" || data.symbol == "FB" || data.symbol == "PBCRY" || data.symbol == "ETFC" || data.symbol == "EXPE")
            console.log("data",data)
            $scope.socket_object[data.symbol] = data.price
            $scope.$apply()
        })
    }

    function reconnect(){

        console.log("disconnect")
        socketStock.close();
        clearInterval(timerId)
        $scope.socket_object ={}
        start()
        setInterval(MyInterval, 5000);
    }

    function MyInterval(){
        //console.log("start interval",$scope.socket_object)
        for(var i=0; i<99; i++)
        {   //console.log("start interval",$scope.filteredItems[i].pair,$scope.socket_object[$scope.filteredItems[i].pair])
            if($scope.socket_object[$scope.filteredItems[i].pair] != undefined && typeof $scope.socket_object[$scope.filteredItems[i].pair] != "undefined")
            {
                //console.log("in if")
                $scope.new_price = $scope.socket_object[$scope.filteredItems[i].pair]

                if($scope.new_price > $scope.filteredItems[i].price)
                    $scope.filteredItems[i].variation = "up"
                else if ($scope.new_price == $scope.filteredItems[i].price)
                    $scope.filteredItems[i].variation = "none"
                else
                    $scope.filteredItems[i].variation = "down"

                $scope.filteredItems[i].price =  $scope.new_price
                $scope.filteredItems[i].change24 = Number(((($scope.new_price -  $scope.filteredItems[i].open24) / $scope.filteredItems[i].open24) * 100).toFixed(2))
                $scope.filteredItems[i].high24 = Number(Math.max($scope.new_price, $scope.filteredItems[i].high24 , $scope.filteredItems[i].open24).toFixed(2))
                $scope.filteredItems[i].low24 = Number(Math.min($scope.new_price, $scope.filteredItems[i].low24 , $scope.filteredItems[i].open24).toFixed(2))
                //console.log("end interval",$scope.filteredItems[0].price)
                $scope.$apply()
            }
        }
        console.log("ok")
    }


        //UPDATE VIA API
        ////////////////
        // setTimeout(function()
        //    {
        //        console.log("$scope.filteredItems", $scope.filteredItems)
        //            setInterval(function(){
        //                  $.ajax({
        //                    url: "https://websocket-stock.herokuapp.com/Getstocks/" + $scope.str,
        //                    type: "GET",
        //                    success: function (result) {
        //                        $scope.update = result
        //                        console.log("$scope.update",$scope.update["AAPL"].price)
        //                        for(var i=0; i<99; i++)
        //                        {
        //                            $scope.filteredItems[i] = $scope.update[$scope.filteredItems[i].pair]
        //
        //                        }
        //
        //                        $scope.$apply()
        //                    },
        //                    error: function (xhr, ajaxOptions, thrownError) {
        //                        console.log("ERROR", thrownError, xhr, ajaxOptions)
        //                    }
        //                })
        //            }, 5000);
        //            $scope.$apply()
        //    }, 2000);

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

    $scope.ActiveChange = function (symbol, name) {

        var new_array = ['-', ' ', '/', '----', '---', '--']
        for(var i=0; i<new_array.length;i++) {
            if (name.indexOf(new_array[i]) > -1) {
                if (new_array[i] == '-')
                    name = name.replace(new RegExp(new_array[i], 'g'), ' ')
                else
                    name = name.replace(new RegExp(new_array[i], 'g'), '-')
            }
            if (name.indexOf("'") > -1) {
               name = name.replace(/'/g, '')
            }
        }

        var url =  decodeURIComponent(Routing.generate('stock_chart',{"symbol" :symbol, "name":name }))
        console.log("url",url)
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

