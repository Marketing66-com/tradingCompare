var stockApp = angular.module('stockApp', ['ui.bootstrap', 'memberService','watchlistService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

stockApp.controller("stockController", function ($scope,$window,$location,MemberService,WatchlistService,$http,$interval,$timeout) {
    // *********** variables for ajax & country ************
    $scope.listCountry = [];
    $scope.country_name;
    $scope.country_value;
    $scope.for_finished = false
    $scope.no_stock = ""

    $scope.result = []
    $scope.country =[]

    $scope.str = ""
    $scope.socket_object = {}

    $scope.Wstock = []; $scope.Wcrypto =[]; $scope.Wforex = []
    // $scope.WatchlistStock = []; $scope.WatchlistCrypto = []; $scope.WatchlistForex = [];
    $scope.WatchlistTemp =[] ;$scope.WatchlistTable =[]
    $scope.strStock = "";  $scope.strCrypto = "";  $scope.strForex = ""

    $scope.onSelect = function ($item, $model, $label) {
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
       // console.log("$scope.$item",$scope.$item.name,$scope.$model,$scope.$label)

        if($scope.$item.name.indexOf(' ') > -1)
            $scope.$item.name = $scope.$item.name.replace(' ', '-')

        if($scope.$item.value.indexOf(' ') > -1)
            $scope.$item.value = $scope.$item.value.replace(' ', '-')

        var url =  Routing.generate('Live_rates_stocks',{"name" :$scope.$item.name, "value":$scope.$item.value})
        //console.log("Routing",Routing.generate('Live_rates_stocks',{"name" :$scope.$item.name, "value":$scope.$item.value}))
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
        $scope.Wstock.forEach(currencie => {
            $scope.filteredItems.forEach(element =>     {
                if(currencie == element.pair){
                   // console.log("pageChanged",currencie,element.pair,element)
                    element.is_in_watchlist = true
                }
            });
        });

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
        // $scope.customSelected = ""
        this.items = itemsDetails;
        $scope.country_name = country_name;
        $scope.country_value = country_value;

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $scope.userLoggedIn = true;
                //console.log("getuser",user)
                user.getIdToken(true).then(function (idToken) {
                    console.log("getIdToken")
                    $scope.idToken = idToken
                    $scope._id = {
                        _id: user.uid
                    }
                    MemberService.getUsersById(idToken, $scope._id).then(function (results) {
                        //console.log("getUsersById",results)
                        $scope.user = results.data
                        if($scope.user.watchlist.length>0){
                            //console.log("in if watchlist.lenght>0")
                            $scope.user.watchlist.forEach(currencie => {
                                if(currencie.type == 'STOCK') {
                                    $scope.Wstock.push(currencie.symbol)
                                    $scope.strStock += currencie.symbol + ","
                                }
                                if(currencie.type == 'CRYPTO') {
                                    $scope.Wcrypto.push(currencie.symbol)
                                    $scope.strCrypto += currencie.symbol + ","
                                }
                                if(currencie.type == 'FOREX') {
                                    $scope.Wforex.push(currencie.symbol)
                                    $scope.strForex += currencie.symbol + ","
                                }
                            });
                            //console.log("$scope.Wstock",$scope.Wstock)
                        }
                        $scope.$apply();
                        //console.log("user get from db",$scope.user)
                    })
                        .then(() => {
                            if($scope.for_finished == true){
                               //console.log("for finished")
                                if($scope.Wstock.length>0){
                                    //console.log("lenght>0")
                                    $scope.Wstock.forEach(currencie => {
                                        $scope.filteredItems.forEach(element =>     {
                                            if(currencie == element.pair){
                                               // console.log("***",currencie,element.pair,element)
                                                element.is_in_watchlist = true
                                                $scope.$apply();
                                            }
                                        });
                                    });
                                }
                                // BuildWatchlist()
                            }
                            else{
                                var check = function() {
                                //console.log("in timeout",$scope.for_finished)
                                    if($scope.for_finished == false) {
                                        console.log("wait for")
                                        $timeout(check, 100);
                                    }
                                    else{
                                       // console.log("in else")
                                        if($scope.Wstock.length>0){
                                            //console.log("lenght>0")
                                            $scope.Wstock.forEach(currencie => {
                                                $scope.filteredItems.forEach(element =>     {
                                                    if(currencie == element.pair){
                                                        //console.log("***",currencie,element.pair,element)
                                                        element.is_in_watchlist = true
                                                        $scope.$apply();
                                                    }
                                                });
                                            });
                                        }
                                        // BuildWatchlist()
                                    }
                                }
                                $timeout(check, 100)
                                $scope.$apply();
                            }
                        })
                        .then(() => {
                            BuildWatchlist()
                        })
                        .catch(function (error) {
                            $scope.data = error;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })

                }).catch(function (error) {
                    console.log('ERROR: ', error)
                });
                $scope.$apply();
            }
            else{
                $scope.userLoggedIn = false;
                $scope.$apply();
            }
        });


        // *********************************

        // *********************************
        $http.get("https://websocket-stock.herokuapp.com/stocks/" + country_value)
            .then(function(result) {
                $scope.result = result.data;
                //console.log("$scope.result",$scope.result)
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

                        //WATCHLIST
                        itemsDetails[j].is_in_watchlist = false

                        j = j+1;
                    }
                }

                //console.log("itemsDetails",itemsDetails)

                $scope.totalItems = itemsDetails.length;

                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                    end = begin + $scope.itemsPerPage;

                $scope.filteredItems = itemsDetails.slice(begin, end);
                //console.log(" $scope.filteredItems", $scope.filteredItems)
            })
            .then(() => {
                $scope.for_finished = true
                if($scope.filteredItems.length>0){
                    $scope.str = ""
                    for(var i = 0; i<= $scope.filteredItems.length; i++) {
                        if ($scope.filteredItems[i] != undefined) {
                            $scope.str = $scope.str + $scope.filteredItems[i].pair + ","
                        }
                    }
                    $scope.str = $scope.str.substring(0, $scope.str.length - 1);
                }
            })
            .catch(function (error) {
            $scope.data = error;
            console.log("error", $scope.data)
            // $scope.$apply();
            })

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

        $scope.delete_from_watchlist_inW = function(index,type) {
            console.log("index",index)
            console.log("$scope.WatchlistTable",$scope.WatchlistTable)

            if($scope.user == undefined || $scope.user.length == 0 ){
                console.log("return")
                return;
            }

            $scope.stock_to_delete = $scope.WatchlistTable[index].pair
            $scope.WatchlistTable.splice(index, 1)

            for(i=0;i<$scope.Wstock.length;i++){
                if($scope.Wstock[i] == $scope.stock_to_delete){
                    $scope.Wstock.splice(i, 1)
                }
            }
            for(j=0;j<$scope.filteredItems.length;j++){
                if($scope.filteredItems[j].pair == $scope.stock_to_delete){
                    $scope.filteredItems[j].is_in_watchlist = false
                }
            }
            console.log("$scope.stock_to_delete",$scope.stock_to_delete)
            $scope.data_to_send ={
                data: { symbol:$scope.stock_to_delete,
                    type:type
                },
                _id: $scope.user._id
            }
            console.log("$scope.data_to_send",$scope.data_to_send)
            MemberService.Delete_from_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
                console.log("delete",results)
            })
                .catch(function (error) {
                    $scope.data = error;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
                })

        }
        $scope.delete_from_watchlist = function(index) {

            if($scope.user == undefined || $scope.user.length == 0 ){
                console.log("return")
                return;
            }
           $scope.filteredItems[index].is_in_watchlist = false

           for(i=0;i<$scope.WatchlistTable.length;i++){
               if($scope.WatchlistTable[i].pair == $scope.filteredItems[index].pair){
                   $scope.WatchlistTable.splice(i, 1)
               }
           }
            for(j=0;j<$scope.Wstock.length;j++){
                if($scope.Wstock[j] == $scope.filteredItems[index].pair){
                    $scope.Wstock.splice(j, 1)
                }
            }
            // console.log("$scope.WatchlistTable after",$scope.WatchlistTable)
            // console.log("$scope.Wstock after",$scope.Wstock)

            $scope.data_to_send ={
                data: { symbol:$scope.filteredItems[index].pair,
                    type:"STOCK"
                },
                _id: $scope.user._id
            }

            MemberService.Delete_from_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
                console.log("delete",results)
            })
            .catch(function (error) {
                    $scope.data = error;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
            })

        }
        $scope.add_to_watchlist = function(index) {

            if($scope.user == undefined || $scope.user.length == 0 ){
                console.log("return")
                return;
            }

            $scope.filteredItems[index].is_in_watchlist =  true
            $scope.WatchlistTable.push($scope.filteredItems[index])
            $scope.Wstock.push($scope.filteredItems[index].pair)

            $scope.data_to_send ={
                data: { symbol:$scope.filteredItems[index].pair,
                    type:"STOCK"
                },
                _id: $scope.user._id
            }
            MemberService.Add_to_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
                //console.log("results",results)
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })

        }

    }
    //

    BuildWatchlist = function(){
        console.log("in fill watchlist")

        //var promises1 = WatchlistService.stockForWatchlist($scope.Wstock,$scope.strStock)
        var promises1 = WatchlistService.cryptoForWatchlist($scope.Wcrypto,$scope.strCrypto)
        var promises2 = WatchlistService.forexForWatchlist($scope.Wforex,$scope.strForex)

        var all_promises = [promises1,promises2]

        $scope.Wstock.forEach(element=>{
            all_promises.push(WatchlistService.stockForWatchlist(element))
        })

        //var promises4 = WatchlistService.stockForWatchlist_test("FB")
        //console.log("promises4",promises4)

        Promise.all(all_promises) .then((Arrays) => {
            //console.log("Arrays",Arrays)
            $scope.WatchlistTemp = Arrays[0].concat(Arrays[1])
            for(i=2;i<Arrays.length;i++){
                $scope.WatchlistTemp.push(Arrays[i])
            }
            // $scope.WatchlistTemp = Arrays[0].concat(Arrays[1]).concat(Arrays[2])
            //console.log("WatchlistTemp",$scope.WatchlistTemp )
            for(i=0;i<$scope.user.watchlist.length;i++){
                for(j=0;j<$scope.WatchlistTemp.length;j++){
                    if($scope.user.watchlist[i].symbol == $scope.WatchlistTemp[j].pair){
                        $scope.WatchlistTable.push($scope.WatchlistTemp[j])
                        break;
                    }
                }
            }
            //console.log("$scope.WatchlistTable",$scope.WatchlistTable)
            $scope.$apply()
        })

    }

    $scope.click_on_star = function(){
        $('.v-modal').slideDown();
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //WEB-SOCKET

    var socketStock;

    let timerId = setInterval(MyInterval, 5000);

    setTimeout(start, 1000);

    function start()
    {
        if(!$scope.for_finished){
            setTimeout(start, 1000);
            //console.log("str empty settimeout again")
        }
        else if($scope.for_finished && $scope.filteredItems.length>0){
            clearInterval(timerId)
            connect()
            setInterval(MyInterval, 5000)
        }
        else if($scope.for_finished && !$scope.filteredItems.length>0){
            //console.log("filteredItems empty")
            $scope.no_stock = "no stock for " + $scope.country_name
           // console.log(" $scope.no_stock", $scope.no_stock)
        }
        $scope.$apply()
        // if($scope.str == "")
        // {
        //     setTimeout(start, 1000);
        //     console.log("str empty settimeout again")
        // }
        //
        // else
        // {
        //     //console.log("str ok go to connect")
        //     clearInterval(timerId)
        //     connect()
        //     setInterval(MyInterval, 5000)
        // }


    }
    function connect(){

        //console.log("in connect")
        socketStock = io.connect("https://ws-api.iextrading.com/1.0/last");
        socketStock.emit("subscribe", $scope.str);
        // console.log("in connect $scope.str", $scope.str)
        socketStock.on("message", (data) => {
            data = JSON.parse(data);
            // if(data.symbol == "AAPL" || data.symbol == "FB" || data.symbol == "PBCRY" || data.symbol == "ETFC" || data.symbol == "EXPE")
            // console.log("data",data)
            $scope.socket_object[data.symbol] = data.price
            $scope.$apply()
        })
    }

    function reconnect(){

        //console.log("disconnect")
        socketStock.close();
        clearInterval(timerId)
        $scope.socket_object ={}
        start()
        setInterval(MyInterval, 5000);
    }

    function MyInterval(){
        //console.log("start interval",$scope.socket_object)
        if($scope.filteredItems != undefined){
            for(var i=0; i<$scope.filteredItems.length; i++)
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
        }
        //console.log("ok")
    }

    /////////////////////////////////////////////////////////////////////////////

    $scope.ActiveChange = function (symbol, name, _locale) {

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

        var url =  decodeURIComponent(Routing.generate('stock_chart',{"symbol" :symbol, "name":name, "_locale": _locale }))
        //console.log("url",url)
        $window.location= url
        return url
    }

    $scope.ActiveChange_Watchlist = function (symbol, type, name, _locale) {

        switch (type) {
            case "STOCK":
                $scope.ActiveChange(symbol, name, _locale)
                break;

            case "CRYPTO":
                if(name.indexOf(' ') > -1)
                    name = name.replace(/ /g, '-')

                var url =  decodeURIComponent(Routing.generate('crypto_chart',{"currency" :symbol, "name" :name, "_locale": _locale}))
                //console.log(Routing.generate('crypto_chart',{"currency" : symbol, "name" :name, "_locale": _locale}))
                $window.location= url
                break;

            case "FOREX":
                var from = symbol.slice(0, 3)
                var to = symbol.slice(3, 6)
                symbol = from + "-" + to
                //console.log("symbol",symbol, _locale)
                var url =  Routing.generate('forex_chart',{"currency" :symbol, "_locale": _locale})
                //console.log(Routing.generate('forex_chart',{"currency" :symbol, "_locale": _locale}))
                $window.location= url
                break;

            default:
                break;
        }
    }

});

var dvStock = document.getElementById('dvStock');

angular.element(document).ready(function() {

    angular.bootstrap(dvStock, ['stockApp']);
});



//*************************************************************************************************
// firstForWatchlist = function (){
//
//     return new Promise(function (resolve, reject) {
//         if($scope.Wstock.length>0) {
//             $scope.strStock = $scope.strStock.substring(0, $scope.strStock.length - 1);
//             //console.log("$scope.strStock", $scope.strStock)
//             $http.get("https://websocket-stock.herokuapp.com/Getstocks/" + $scope.strStock)
//                 .then(function (response) {
//                     //console.log("response", response.data)
//                     if ($scope.Wstock.length > 1) {
//                         //console.log("in if", $scope.Wstock)
//                         for (const key in response.data) {
//                             //console.log("response.data",response.data)
//                             //NAME
//                             response.data[key].complete_name = response.data[key].name
//                             if (response.data[key].name.length >=17)
//                                 response.data[key].name = response.data[key].name.substr(0, 17);
//
//                             //IMAGE
//                             var img = "https://storage.googleapis.com/iex/api/logos/" + key + ".png"
//                             if(response.data[key].img == undefined || typeof response.data[key].img == "undefined" || img == undefined || typeof img == "undefined")
//                                 response.data[key].img = "/img/Stock_Logos/stocks.png"
//                             else
//                                 response.data[key].img = img
//
//                             // SENTIMENT
//                             var sent=(response.data[key].likes / (response.data[key].likes + response.data[key].unlikes)) *100
//                             response.data[key].sentiment=Number(sent.toFixed(1))
//
//                             $scope.WatchlistStock.push(response.data[key])
//                         }
//                     }
//                     else {
//                         //NAME
//                         response.data.complete_name = response.data.name
//                         if (response.data.name.length >=17)
//                             response.data.name = response.data.name.substr(0, 17);
//
//                         //IMAGE
//                         var img = "https://storage.googleapis.com/iex/api/logos/" + key + ".png"
//                         if(response.data.img == undefined || typeof response.data.img == "undefined" || img == undefined || typeof img == "undefined")
//                             response.data.img = "/img/Stock_Logos/stocks.png"
//                         else
//                             response.data.img = img
//
//                         // SENTIMENT
//                         var sent=(response.data.likes / (response.data.likes + response.data.unlikes)) *100
//                         response.data.sentiment=Number(sent.toFixed(1))
//
//                         $scope.WatchlistStock = response.data;
//                     }
//                     //console.log("$scope.WatchlistStock", $scope.WatchlistStock)
//                     resolve ($scope.WatchlistStock)
//                 });
//         }
//         else{
//             resolve ($scope.WatchlistStock)
//         }
//     });
// }
// secondForWatchlist = function (){
//
//     return new Promise(function (resolve, reject) {
//         if($scope.Wcrypto.length>0) {
//             $scope.strCrypto = $scope.strCrypto.substring(0, $scope.strCrypto.length - 1);
//             $http.get("https://crypto.tradingcompare.com/AllPairs/" + $scope.strCrypto)
//                 .then(function (response) {
//                     console.log("Wcrypto",response.data)
//                     if ($scope.Wcrypto.length > 1) {
//                         for (const key in response.data) {
//                             //NAME
//                             if(response.data[key].name.substr(response.data[key].name.length - 1) == ' ')
//                                 response.data[key].name = response.data[key].name.substring(0, response.data[key].name.length - 1);
//                             response.data[key].complete_name = response.data[key].name
//                             if (response.data[key].name.length >=17)
//                                 response.data[key].name = response.data[key].name.substr(0, 17);
//
//                             //IMAGE
//                             if(response.data[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
//                                 response.data[key].img == undefined
//                                 || typeof response.data[key].img== "undefined"){
//
//                                 response.data[key].img = "/img/crypto_logos/crypto-other.png"
//                             }
//
//                             //SENTIMENT
//                             var sent=(response.data[key].likes / (response.data[key].likes + response.data[key].unlikes)) *100
//                             response.data[key].sentiment=Number(sent.toFixed(1))
//
//                             $scope.WatchlistCrypto.push(response.data[key])
//                         }
//                     }
//                     else {
//                         if(response.data.name.substr(response.data.name.length - 1) == ' ')
//                             response.data.name = response.data.name.substring(0, response.data.name.length - 1);
//                         response.data.complete_name = response.data.name
//                         if (response.data.name.length >=17)
//                             response.data.name = response.data.name.substr(0, 17);
//
//                         //IMAGE
//                         if(response.data.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
//                             response.data.img == undefined
//                             || typeof response.data.img== "undefined"){
//
//                             response.data.img = "/img/crypto_logos/crypto-other.png"
//                         }
//
//                         //SENTIMENT
//                         var sent=(response.data.likes / (response.data.likes + response.data.unlikes)) *100
//                         response.data.sentiment=Number(sent.toFixed(1))
//
//                         $scope.WatchlistCrypto = response.data;
//                     }
//                     resolve ($scope.WatchlistCrypto)
//                 });
//         }
//         else{
//             resolve ($scope.WatchlistCrypto)
//         }
//
//     });
// }
// thirdForWatchlist = function (){
//
//     return new Promise(function (resolve, reject) {
//         if($scope.Wforex.length>0) {
//             $scope.strForex = $scope.strForex.substring(0, $scope.strForex.length - 1);
//             $http.get("https://forex.tradingcompare.com/all_data/" + $scope.strForex)
//                 .then(function (response) {
//                     if ($scope.Wforex.length > 1) {
//                         for (const key in response.data) {
//                             //NAME
//                             response.data[key].complete_name = response.data[key].name
//
//                             //IMAGE
//                             if(response.data[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
//                                 response.data[key].img == undefined
//                                 || typeof response.data[key].img== "undefined"){
//
//                                 response.data[key].img =  "/img/Stock_Logos/stocks.png"
//                             }
//
//                             //SENTIMENT
//                             var sent=(response.data[key].likes / (response.data[key].likes + response.data[key].unlikes)) *100
//                             response.data[key].sentiment=Number(sent.toFixed(1))
//
//                             $scope.WatchlistForex.push(response.data[key])
//                         }
//                     }
//                     else {
//                         //NAME
//                         response.data.complete_name = response.data.name
//
//                         //IMAGE
//                         if(response.data.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
//                             response.data.img == undefined
//                             || typeof response.data.img== "undefined"){
//
//                             response.data.img =  "/img/Stock_Logos/stocks.png"
//                         }
//
//                         //SENTIMENT
//                         var sent=(response.data.likes / (response.data.likes + response.data.unlikes)) *100
//                         response.data.sentiment=Number(sent.toFixed(1))
//                         $scope.WatchlistForex = response.data;
//                     }
//                     resolve ($scope.WatchlistForex)
//                 });
//         }
//         else{
//             resolve ($scope.WatchlistForex)
//         }
//
//     });
// }
//*************************************************************************
 // BuildWatchlist = function(){
    //     console.log("in fill watchlist")
    //
    //     if($scope.Wstock.length>0){
    //         console.log("$scope.Wstock.length",$scope.Wstock.length)
    //         $scope.strStock = $scope.strStock.substring(0, $scope.strStock.length - 1);
    //         console.log("$scope.strStock",$scope.strStock)
    //         $http.get("https://websocket-stock.herokuapp.com/Getstocks/" + $scope.strStock)
    //             .then(function(response) {
    //                 console.log("response",response.data)
    //                 if($scope.Wstock.length > 1){
    //                     console.log("in if",$scope.Wstock)
    //                     for(const key in response.data){
    //                         $scope.WatchlistTable.push(response.data[key])
    //
    //                     }
    //                 }
    //                 else{
    //                     $scope.WatchlistTable = response.data;
    //                 }
    //                 //console.log("$scope.WatchlistStock",$scope.WatchlistStock)
    //             });
    //     }
    //
    //     if($scope.Wcrypto.length>0) {
    //         $scope.strCrypto = $scope.strCrypto.substring(0, $scope.strCrypto.length - 1);
    //         $http.get("https://crypto.tradingcompare.com/AllPairs/" + $scope.strCrypto)
    //             .then(function (response) {
    //                 if ($scope.Wcrypto.length > 1) {
    //                     for (const key in response.data) {
    //                         $scope.WatchlistTable.push(...response.data[key])
    //
    //                     }
    //                 }
    //                 else {
    //                     $scope.WatchlistTable = response.data;
    //                 }
    //             });
    //     }
    //
    //     if($scope.Wforex.length>0) {
    //         $scope.strForex = $scope.strForex.substring(0, $scope.strForex.length - 1);
    //         $http.get("https://forex.tradingcompare.com/all_data/" + $scope.strForex)
    //             .then(function (response) {
    //                 if ($scope.Wforex.length > 1) {
    //                     for (const key in response.data) {
    //                         $scope.WatchlistTable.push(...response.data[key])
    //                     }
    //                 }
    //                 else {
    //                     $scope.WatchlistTable = response.data;
    //                 }
    //             });
    //     }
    //
    //     // Promise.all([promises1,promises2,promises3]) .then((value) => {
    //     //     console.log("value",value)
    //     //     $scope.WatchlistTable = [...value[0]]
    //     //     console.log("concat",$scope.WatchlistStock.concat($scope.WatchlistCrypto))
    //         console.log("$scope.WatchlistTable",$scope.WatchlistTable)
    //     // })
    //
    //     $scope.$apply()
    // }