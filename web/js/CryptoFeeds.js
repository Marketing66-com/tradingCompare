var CryptoApp = angular.module('CryptoApp', ['ui.bootstrap', 'memberService','watchlistService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

CryptoApp.controller('ListController', function($scope,$window,$location,MemberService,WatchlistService,$http,$interval,$timeout) {

    let itemsDetails = [];
    $scope.maxSize = 5;

    $scope.currentPage = 1;
    $scope.totalItems = function () {
        return itemsDetails.length;
    };
    $scope.itemsPerPage = 100;

    $scope.result = [];

    $scope.for_finished = false

    $scope.Wstock = []; $scope.Wcrypto =[]; $scope.Wforex = []
    // $scope.WatchlistStock = []; $scope.WatchlistCrypto = []; $scope.WatchlistForex = [];
    $scope.WatchlistTemp =[] ;$scope.WatchlistTable =[]
    $scope.strStock = "";  $scope.strCrypto = "";  $scope.strForex = ""

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.filteredItems = itemsDetails.slice(begin, end);
        $scope.Wcrypto.forEach(currencie => {
            $scope.filteredItems.forEach(element =>     {
                if(currencie == element.pair){
                  //  console.log("pageChanged",currencie,element.pair,element)
                    element.is_in_watchlist = true
                }
            });
        });
        $(document).scrollTop(0);
    };

    $scope.init = function (crypto_api) {
        this.items = itemsDetails;

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $scope.userLoggedIn = true;
               // console.log("getuser")
                user.getIdToken(true).then(function (idToken) {
                    console.log("getIdToken")
                    $scope.idToken = idToken
                    $scope._id = {
                        _id: user.uid
                    }
                    MemberService.getUsersById(idToken, $scope._id).then(function (results) {
                        console.log("getUsersById")
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
                              //  console.log("for finished")
                                if($scope.Wcrypto.length>0){
                                    //console.log("lenght>0")
                                    $scope.Wcrypto.forEach(currencie => {
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
                                   // console.log("in timeout",$scope.for_finished)
                                    if($scope.for_finished == false) {
                                        console.log("wait for")
                                        $timeout(check, 100);
                                    }
                                    else{
                                      //  console.log("in else")
                                        if($scope.Wcrypto.length>0){
                                            //console.log("lenght>0")
                                            $scope.Wcrypto.forEach(currencie => {
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
        //
        $http.get(crypto_api)
            .then(function(result) {
                $scope.result = result.data;
                //console.log("$scope.result*****",$scope.result)

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
                //console.log("itemsDetails",itemsDetails)
                $scope.totalItems = itemsDetails.length;

                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                    end = begin + $scope.itemsPerPage;

                $scope.filteredItems = itemsDetails.slice(begin, end);
                // $scope.$apply()

            })
            .then(() => {
                $scope.for_finished = true
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("test error", $scope.data)
                $scope.$apply();
            })


    }

    $scope.getDisplayValue = function(currentValue)
    {
        return intFormat(currentValue);
    }

    $scope.ActiveChange = function (symbol, name, _locale) {

        //console.log("activechange", symbol, name, _locale)

        if(name.indexOf(' ') > -1)
            name = name.replace(/ /g, '-')

        var url =  decodeURIComponent(Routing.generate('crypto_chart',{"currency" :symbol, "name" :name, "_locale": _locale}))
        //console.log(Routing.generate('crypto_chart',{"currency" : symbol, "name" :name, "_locale": _locale}))
        $window.location= url
        return url
    }

    $scope.ActiveChange_Watchlist = function (symbol, type, name, _locale) {

        switch (type) {
            case "STOCK":
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
                break;

            case "CRYPTO":
                $scope.ActiveChange(symbol, name, _locale)
                break;

            case "FOREX":
                var from = symbol.slice(0, 3)
                var to = symbol.slice(3, 6)
                symbol = from + "-" + to
              //  console.log("symbol",symbol, _locale)
                var url =  Routing.generate('forex_chart',{"currency" :symbol, "_locale": _locale})
                //console.log(Routing.generate('forex_chart',{"currency" :symbol, "_locale": _locale}))
                $window.location= url
                break;

            default:
                break;
        }
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

    BuildWatchlist = function(){
      //  console.log("in fill watchlist")

        var promises1 = WatchlistService.cryptoForWatchlist($scope.Wcrypto,$scope.strCrypto)
        var promises2 = WatchlistService.forexForWatchlist($scope.Wforex,$scope.strForex)

        var all_promises = [promises1,promises2]
        $scope.Wstock.forEach(element=>{
            all_promises.push(WatchlistService.stockForWatchlist(element))
        })

        Promise.all(all_promises) .then((Arrays) => {
            //console.log("Arrays",Arrays)
            $scope.WatchlistTemp = Arrays[0].concat(Arrays[1])
            for(i=2;i<Arrays.length;i++){
                $scope.WatchlistTemp.push(Arrays[i])
            }
            //console.log("WatchlistTemp",$scope.WatchlistTemp )
            for(i=0;i<$scope.user.watchlist.length;i++){
                for(j=0;j<$scope.WatchlistTemp.length;j++){
                    if($scope.user.watchlist[i].symbol == $scope.WatchlistTemp[j].pair){
                        $scope.WatchlistTable.push($scope.WatchlistTemp[j])
                        break;
                    }
                }
            }
           // console.log("$scope.WatchlistTable",$scope.WatchlistTable)
            $scope.$apply()
        })

    }


    $scope.delete_from_watchlist_inW = function(index,type) {
        // console.log("index",index)
        // console.log("$scope.WatchlistTable",$scope.WatchlistTable[index])

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

        $scope.data_to_send ={
            data: { symbol:$scope.stock_to_delete,
                type:type
            },
            _id: $scope.user._id
        }

        MemberService.Delete_from_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
            //console.log("delete",results)
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
                type:"CRYPTO"
            },
            _id: $scope.user._id
        }

        MemberService.Delete_from_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
            //console.log("delete",results)
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
                type:"CRYPTO"
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

    $scope.click_on_star = function(){
        $('.modal_sigh-up').slideDown();
    }

});


var dvCrypto = document.getElementById('dvCrypto');
angular.element(document).ready(function() {
    angular.bootstrap(dvCrypto, ['CryptoApp']);
});


//currencies
// $.ajax({
//     url: crypto_api,
//     type: "GET",
//     success: function (result) {
//         $scope.result = result;
//         //console.log("$scope.result",$scope.result)
//
//         var i = 0
//         for (const key in $scope.result) {
//             if ($scope.result.hasOwnProperty(key)) {
//
//                 itemsDetails[i] = $scope.result[key];
//
//                 //NAME
//                 if(itemsDetails[i].name.substr(itemsDetails[i].name.length - 1) == ' ')
//                     itemsDetails[i].name = itemsDetails[i].name.substring(0, itemsDetails[i].name.length - 1);
//                 itemsDetails[i].complete_name = itemsDetails[i].name
//                 if (itemsDetails[i].name.length >=17)
//                     itemsDetails[i].name = itemsDetails[i].name.substr(0, 17);
//
//                 //IMAGE
//                 if($scope.result[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
//                     $scope.result[key].img == undefined
//                     || typeof $scope.result[key].img== "undefined"){
//
//                     itemsDetails[i].img = "/img/crypto_logos/crypto-other.png"
//                 }
//
//                 //SENTIMENT
//                 var sent=($scope.result[key].likes / ($scope.result[key].likes + $scope.result[key].unlikes)) *100
//                 itemsDetails[i].sentiment=Number(sent.toFixed(1))
//
//                 i = i+1;
//             }
//         }
//         //console.log("itemsDetails",itemsDetails)
//         $scope.totalItems = itemsDetails.length;
//
//         var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
//             end = begin + $scope.itemsPerPage;
//
//         $scope.filteredItems = itemsDetails.slice(begin, end);
//         $scope.$apply()
//
//         // HERE
//     },
//     error: function (xhr, ajaxOptions, thrownError) {
//         console.log("ERROR", thrownError, xhr, ajaxOptions)
//     }
// });