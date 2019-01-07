var stockApp = angular.module('stockApp', ['ui.bootstrap', 'memberService','watchlistService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

stockApp.controller("stockController", function ($scope,$window,$location,MemberService,WatchlistService,$http,
                                                 $interval,$timeout,$uibModal) {
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
    $scope.user_sentiments = []

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
        $scope.spinner = true

        this.items = itemsDetails;
        $scope.country_name = country_name;
        $scope.country_value = country_value;

        //***************************************************
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
                    MemberService.getUsersById($scope.idToken, $scope._id).then(function (results) {
                        console.log("getUsersById",results.data._id)
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
                        }
                        $scope.$apply();
                    }).then(() => {
                        MemberService.getSentimentsByUser($scope.idToken, $scope.user._id).then(function (results) {
                           // console.log("getSentimentsByUser",results)
                            $scope.user_sentiments = results
                            // $scope.user_sentiments = results
                            $scope.$apply();
                        })
                        .then(()=>{
                            if($scope.for_finished == true){
                                //console.log("for finished, sentiment")
                                if($scope.user_sentiments.length>0) {
                                    $scope.user_sentiments.forEach(element => {
                                        if (element.symbol_type == 'STOCK' && element.status == 'OPEN') {
                                            $scope.filteredItems.forEach(element_table => {
                                                if (element.symbol == element_table.pair) {
                                                    element_table.status_sentiment = 'OPEN'
                                                    element_table.type_sentiment = element.type
                                                }
                                            });
                                        }
                                    });
                                    $scope.user_sentiments_finished = true
                                }
                                else{
                                    $scope.user_sentiments_finished = true
                                }
                            }
                            else{
                                var check = function() {
                                    //console.log("in timeout",$scope.for_finished)
                                    if($scope.for_finished == false) {
                                        console.log("wait for sentiment")
                                        $timeout(check, 100);
                                    }
                                    else{
                                        if($scope.user_sentiments.length>0) {
                                            $scope.user_sentiments.forEach(element => {
                                                if (element.symbol_type == 'STOCK' && element.status == 'OPEN') {
                                                    $scope.filteredItems.forEach(element_table => {
                                                        if (element.symbol == element_table.pair) {
                                                            element_table.status_sentiment = 'OPEN'
                                                            element_table.type_sentiment = element.type
                                                        }
                                                    });
                                                }
                                            });
                                            $scope.user_sentiments_finished = true
                                        }
                                        else{
                                            $scope.user_sentiments_finished = true
                                        }
                                    }
                                }
                                $timeout(check, 100)
                            }
                            $scope.$apply();
                            })
                        .then(()=>{
                            SentimentToWatch()
                        })
                        .catch(function (error) {
                            $scope.data = error;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })
                    })
                    .then(() => {
                            if($scope.for_finished == true){
                               // console.log("for finished, watchlist")
                                if($scope.Wstock.length>0){
                                    $scope.Wstock.forEach(currencie => {
                                        $scope.filteredItems.forEach(element => {
                                            if(currencie == element.pair){
                                                element.is_in_watchlist = true
                                            }
                                        });
                                    });
                                    $scope.user_watchlist_finished = true
                                }
                                else{
                                    $scope.user_watchlist_finished = true
                                }
                            }
                            else{
                                var check = function() {
                                //console.log("in timeout",$scope.for_finished)
                                    if($scope.for_finished == false) {
                                        console.log("wait for, watchlist")
                                        $timeout(check, 100);
                                    }
                                    else{
                                        if($scope.Wstock.length>0){
                                            $scope.Wstock.forEach(currencie =>{
                                                $scope.filteredItems.forEach(element =>{
                                                    if(currencie == element.pair){
                                                        element.is_in_watchlist = true
                                                    }
                                                });
                                            });
                                            $scope.user_watchlist_finished = true
                                        }
                                        else{
                                            $scope.user_watchlist_finished = true
                                        }
                                    }
                                }
                                $timeout(check, 100)
                            }
                        $scope.$apply();
                    })
                    .then(() => {
                            BuildWatchlist()
                    })
                    .then(()=>{
                        var check = function() {
                            if($scope.idToken != undefined &&
                                $scope.user != undefined &&
                                $scope.user_sentiments != undefined &&
                                $scope.for_finished == true &&
                                $scope.watch_ready == true &&
                                $scope.user_sentiments_finished == true &&
                                $scope.user_watchlist_finished == true) {
                                $scope.spinner = false
                            }
                            else{
                                // console.log("wait for, watchlist")
                                $timeout(check, 100);
                            }
                        }
                        $timeout(check, 100)
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
                console.log("no user")
                $scope.$apply();
            }
        });

        // *********************************
        // ***********************************************************************
        $http.get("https://websocket-stock.herokuapp.com/stocks/" + country_value)
            .then(function(result) {
                $scope.result = result.data;
                $http.post("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiment-by-type/",{symbol_type: 'STOCK'})
                   .then(function(response) {
                     //console.log("response from sentiment-by-type",response.data)
                     $scope.all_stock_sentiments = response.data
                   })
                   .then(function() {
                     //console.log("$scope.result",$scope.result)
                     var j = 0
                     for (const key in $scope.result) {
                         if ($scope.result.hasOwnProperty(key)) {

                         itemsDetails[j] = $scope.result[key];
                         itemsDetails[j].type = 'STOCK'

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
                         if($scope.all_stock_sentiments.hasOwnProperty($scope.result[key].pair)){
                             if( Number($scope.all_stock_sentiments[$scope.result[key].pair].BULLISH) >=
                                 Number($scope.all_stock_sentiments[$scope.result[key].pair].BEARISH) ){
                                 itemsDetails[j].more_bullish = true
                             }
                             else {
                                 itemsDetails[j].more_bullish = false
                             }

                             $scope.max_sentiment = Math.max($scope.all_stock_sentiments[$scope.result[key].pair].BEARISH,
                                 $scope.all_stock_sentiments[$scope.result[key].pair].BULLISH)
                             var sent=($scope.max_sentiment / ($scope.all_stock_sentiments[$scope.result[key].pair].BEARISH +
                                 $scope.all_stock_sentiments[$scope.result[key].pair].BULLISH)) *100
                         }
                         else{
                             var sent = 50
                             itemsDetails[j].more_bullish = true
                         }

                         itemsDetails[j].sentiment=Number(sent.toFixed(1))

                         //WATCHLIST
                         itemsDetails[j].is_in_watchlist = false

                         //SENTIMENT USER
                         itemsDetails[j].status_sentiment = 'CLOSE'
                         itemsDetails[j].type_sentiment = 'none'

                         j = j+1;
                         }
                     }

                     //console.log("itemsDetails",itemsDetails)
                     $scope.totalItems = itemsDetails.length;

                     var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                     end = begin + $scope.itemsPerPage;
                     $scope.filteredItems = itemsDetails.slice(begin, end);
                     //console.log(" $scope.filteredItems ", $scope.filteredItems.length )
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
                })
        .catch(function (error) {
            $scope.data = error;
            console.log("error", $scope.data)
            // $scope.$apply();
        })

        // ***************************************************************
        $http.post("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiment-by-type/",{symbol_type: 'CRYPTO'})
            .then(function(response) {
               // console.log(response.data)
                $scope.all_crypto_sentiments = response.data
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("error", $scope.data)
                // $scope.$apply();
            })

        $http.post("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiment-by-type/",{symbol_type: 'FOREX'})
            .then(function(response) {
                //console.log(response.data)
                $scope.all_forex_sentiments = response.data
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("error", $scope.data)
                // $scope.$apply();
            })

       // ***************************************************************

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
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        })
    }

    //******  WATCHLIST ************  ADD - DELETE FUNCTIONS ****************///
    $scope.delete_from_watchlist_inW = function(index,type) {
        //console.log("index",index)
        //console.log("$scope.WatchlistTable",$scope.WatchlistTable)

        if($scope.user == undefined || $scope.user.length == 0 ){
            console.log("return")
            return;
        }
        if($scope.user.phone_number == ""){
            $('.modal_sigh-up').slideDown();
            return;
        }
        if(!$scope.user.verifyData.is_phone_number_verified){
            $('.modal_sigh-up').slideDown();
            return;
        }

        $scope.stock_to_delete = $scope.WatchlistTable[index].pair
        $scope.WatchlistTable.splice(index, 1)

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
        //console.log("$scope.data_to_send",$scope.data_to_send)
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
        if($scope.user.phone_number == ""){
            $('.modal_sigh-up').slideDown();
            return;
        }

        if(!$scope.user.verifyData.is_phone_number_verified){
            $('.modal_sigh-up').slideDown();
            return;
        }

        //delete from feed table
        $scope.filteredItems[index].is_in_watchlist = false

        //delete from watchlist table
        for(i=0;i<$scope.WatchlistTable.length;i++){
            if($scope.WatchlistTable[i].pair == $scope.filteredItems[index].pair){
                $scope.WatchlistTable.splice(i, 1)
            }
        }

        $scope.data_to_send ={
            data: { symbol:$scope.filteredItems[index].pair,
                type:"STOCK"
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

        if($scope.user.phone_number == ""){
            $('.modal_sigh-up').slideDown();
            return;
        }

        if(!$scope.user.verifyData.is_phone_number_verified){
            $('.modal_sigh-up').slideDown();
            return;
        }

        $scope.filteredItems[index].is_in_watchlist =  true
        $scope.WatchlistTable.push($scope.filteredItems[index])

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
    $scope.click_on_star = function(){
        //console.log("in click_on_star")
        $('.modal_sigh-up').slideDown();
    }


    // ***** SENTIMENTS *****
    $scope.add_sentiment = function(index, type) {
        var the_symbol = $scope.filteredItems[index].pair
        // console.log("index",$scope.all_stock_sentiments[the_symbol])
        if($scope.user == undefined || $scope.user.length == 0 ){
            console.log("return")
            return;
        }
        if($scope.user.phone_number == ""){
            $('.modal_sigh-up').slideDown();
            return;
        }
        if(!$scope.user.verifyData.is_phone_number_verified){
            $('.modal_sigh-up').slideDown();
            return;
        }
        // add to filterItem (and ItemDetails)
        $scope.filteredItems[index].status_sentiment =  'OPEN'
        $scope.filteredItems[index].type_sentiment =  type

        //add to watchlist
        for(i=0;i<$scope.WatchlistTable.length;i++){
            if($scope.WatchlistTable[i].pair == $scope.filteredItems[index].pair){
                $scope.WatchlistTable[i].status_sentiment =  'OPEN'
                $scope.WatchlistTable[i].type_sentiment =  type
            }
        }

        //** bar **//
        $scope.flag = false
        bar_sentiment_for_add_in_feed (index,the_symbol,type,$scope.flag)
        //** end **//

        $scope.data_to_send ={
            _id: $scope.user._id,
            symbol: $scope.filteredItems[index].pair,
            symbol_type: $scope.filteredItems[index].type,
            type: type,
            price: $scope.filteredItems[index].price
        }
        $scope.data_to_send["close_date"] = null;
        $scope.data_to_send["close_price"] = null;
        $scope.data_to_send["status"] = 'OPEN'
        $scope.data_to_send["user_id"] = $scope.user._id
        $scope.d = new Date();
        $scope.data_to_send["date"] = $scope.d.getFullYear() + "-" + ($scope.d.getMonth() + 1) + "-" + $scope.d.getDate()

        ////console.log($scope.data_to_send)
        MemberService.Add_sentiment($scope.idToken, $scope.data_to_send).then(function (results) {
            //console.log("results",results.data)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    }

    $scope.add_sentiment_inW = function(index, type) {
        //console.log("index",index, type,$scope.filteredItems[index])
        var the_symbol = $scope.WatchlistTable[index].pair
        if($scope.user == undefined || $scope.user.length == 0 ){
            console.log("return")
            return;
        }
        if($scope.user.phone_number == ""){
            $('.modal_sigh-up').slideDown();
            return;
        }
        if(!$scope.user.verifyData.is_phone_number_verified){
            $('.modal_sigh-up').slideDown();
            return;
        }
        // add to watchlist
        $scope.WatchlistTable[index].status_sentiment =  'OPEN'
        $scope.WatchlistTable[index].type_sentiment =  type

        //add to filterItem (and ItemDetails)
        for(i=0;i<$scope.filteredItems.length;i++){
            if($scope.filteredItems[i].pair == $scope.WatchlistTable[index].pair){
                $scope.filteredItems[i].status_sentiment =  'OPEN'
                $scope.filteredItems[i].type_sentiment =  type
            }
        }

        //** bar **//
        $scope.flag = false
        bar_sentiment_for_add_in_watchlist(index,the_symbol,type,$scope.flag)
        //** end **//

        $scope.data_to_send ={
            _id: $scope.user._id,
            symbol: $scope.WatchlistTable[index].pair,
            symbol_type: $scope.WatchlistTable[index].type,
            type: type,
            price: $scope.WatchlistTable[index].price
        }
        $scope.data_to_send["close_date"] = null;
        $scope.data_to_send["close_price"] = null;
        $scope.data_to_send["status"] = 'OPEN'
        $scope.data_to_send["user_id"] = $scope.user._id
        $scope.d = new Date();
        $scope.data_to_send["date"] = $scope.d.getFullYear() + "-" + ($scope.d.getMonth() + 1) + "-" + $scope.d.getDate()

        //console.log($scope.data_to_send)
        MemberService.Add_sentiment($scope.idToken, $scope.data_to_send).then(function (results) {
            //console.log("results",results.data)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    }

    $scope.AlreadyOpen = function(index, array) {

        if($scope.user_sentiments == undefined) {
            console.log("return")
            return;
        }

        if(array == 'feed'){
            $scope.resolve = {curr:$scope.filteredItems[index]}
        }
        else{
            $scope.resolve = {curr:$scope.WatchlistTable[index]}
        }

        var modalInstance =  $uibModal.open({
            templateUrl: '/js/sentiment_already_exist.html',
            controller: "OpenSentimentCtrl",
            size: '',
            resolve: $scope.resolve
        });


        modalInstance.result.then(function(response){
            // var url =  Routing.generate('social_sentiment')
            // $window.location= url
        });

    };


    BuildWatchlist = function(){
        //console.log("in fill watchlist")

        var promises1 = WatchlistService.cryptoForWatchlist($scope.Wcrypto,$scope.strCrypto)
        var promises2 = WatchlistService.forexForWatchlist($scope.Wforex,$scope.strForex)

        var all_promises = [promises1,promises2]

        $scope.Wstock.forEach(element=>{
            all_promises.push(WatchlistService.stockForWatchlist(element))
        })

        // $scope.all_sentiments = Object.assign({}, $scope.all_forex_sentiments, $scope.all_crypto_sentiments, $scope.all_stock_sentiments);

        Promise.all(all_promises) .then((Arrays) => {
            //console.log("Arrays", Arrays)
            $scope.WatchlistTemp = Arrays[0].concat(Arrays[1])
            for (i = 2; i < Arrays.length; i++) {
                $scope.WatchlistTemp.push(Arrays[i])
            }
            //console.log("WatchlistTemp",$scope.WatchlistTemp )
            $scope.$apply()
        }).then(()=>{
            for(i=0;i<$scope.user.watchlist.length;i++){
                for(j=0;j<$scope.WatchlistTemp.length;j++){
                    if($scope.user.watchlist[i].symbol == $scope.WatchlistTemp[j].pair){
                        $scope.WatchlistTable.push($scope.WatchlistTemp[j])
                        break;
                    }
                }
            }
            $scope.$apply()
            //console.log("$scope.WatchlistTable",$scope.WatchlistTable)
        })
        .then(()=>{
            $scope.watch_ready = true
        })
        .then(()=>{
            var check = function() {
                if($scope.all_stock_sentiments == undefined || $scope.all_forex_sentiments == undefined || $scope.all_crypto_sentiments == undefined){
                    console.log("stock sentiment undefined")
                    $timeout(check, 100)
                }
                else{
                    $scope.all_sentiments = angular.extend($scope.all_forex_sentiments, $scope.all_crypto_sentiments, $scope.all_stock_sentiments);
                    //console.log("all_sentiments",$scope.all_sentiments)

                    for(i=0;i<$scope.WatchlistTable.length;i++) {
                        if ($scope.all_sentiments.hasOwnProperty($scope.WatchlistTable[i].pair)) {

                            if($scope.all_sentiments[$scope.WatchlistTable[i].pair].BULLISH >= $scope.all_sentiments[$scope.WatchlistTable[i].pair].BEARISH ){
                                $scope.WatchlistTable[i].more_bullish = true
                            }
                            else{
                                $scope.WatchlistTable[i].more_bullish = false
                            }
                            $scope.max_sentiment_forWt = Math.max($scope.all_sentiments[$scope.WatchlistTable[i].pair].BEARISH,
                                $scope.all_sentiments[$scope.WatchlistTable[i].pair].BULLISH)
                            $scope.WatchlistTable[i].sentiment = Number((($scope.max_sentiment_forWt / ($scope.all_sentiments[$scope.WatchlistTable[i].pair].BEARISH +
                                $scope.all_sentiments[$scope.WatchlistTable[i].pair].BULLISH)) * 100).toFixed(1))
                        }
                        else {
                            $scope.WatchlistTable[i].sentiment = 50
                            $scope.WatchlistTable[i].more_bullish = true
                        }
                    }
                }
            }
            $timeout(check, 100)
            //console.log("$scope.WatchlistTable",$scope.WatchlistTable)
        })

        $scope.$apply()
    }

    SentimentToWatch = function(){
        var check = function() {
            if($scope.watch_ready){
                $scope.WatchlistTable.forEach(element_watchlistTable => {
                    $scope.user_sentiments.forEach(element_user_sentiment => {
                        if(element_user_sentiment.symbol == element_watchlistTable.pair && element_user_sentiment.status == 'OPEN'){
                            element_watchlistTable.status_sentiment = 'OPEN'
                            element_watchlistTable.type_sentiment = element_user_sentiment.type
                        }
                    })
                })
            }
            else{
                $timeout(check, 100)
            }
        }
        $timeout(check, 100)
        $scope.$apply()
    }

    bar_sentiment_for_add_in_feed = function(index,the_symbol,type,flag){
        //console.log("***$scope.all_stock_sentiments",$scope.all_stock_sentiments)
        if($scope.all_stock_sentiments.hasOwnProperty(the_symbol)){
            if(!flag){
                if(type == 'BULLISH') {
                    $scope.all_stock_sentiments[the_symbol].BULLISH =
                        Number($scope.all_stock_sentiments[the_symbol].BULLISH + 1);
                }
                else {
                    $scope.all_stock_sentiments[the_symbol].BEARISH =
                        Number($scope.all_stock_sentiments[the_symbol].BEARISH + 1);
                }
            }

            if( Number($scope.all_stock_sentiments[the_symbol].BULLISH) >=
                Number($scope.all_stock_sentiments[the_symbol].BEARISH) ){
                $scope.filteredItems[index].more_bullish = true
            }
            else {
                $scope.filteredItems[index].more_bullish = false
            }
        }
        else{
            if(type == 'BULLISH'){
                $scope.all_stock_sentiments[the_symbol] = {BEARISH:0,BULLISH:1}
                $scope.filteredItems[index].more_bullish = true
            }
            else{
                $scope.all_stock_sentiments[the_symbol] = {BEARISH:1,BULLISH:0}
                $scope.filteredItems[index].more_bullish = false
            }
        }

        $scope.max_sentiment_for_add = Math.max($scope.all_stock_sentiments[the_symbol].BEARISH,
            $scope.all_stock_sentiments[the_symbol].BULLISH)

        var sent=($scope.max_sentiment_for_add / ($scope.all_stock_sentiments[the_symbol].BEARISH +
            $scope.all_stock_sentiments[the_symbol].BULLISH)) *100

        $scope.filteredItems[index].sentiment=Number(sent.toFixed(1))
        //console.log("index2",$scope.all_stock_sentiments[the_symbol],$scope.all_sentiments[the_symbol])

        // IN WATCHLIST
        if(!flag){
            for(i=0;i<$scope.WatchlistTable.length;i++){
                if($scope.WatchlistTable[i].pair == the_symbol){
                    // change_pourcent_in_watchlist(i,the_symbol,type)
                    $scope.flag = true
                    bar_sentiment_for_add_in_watchlist(i,the_symbol,type,$scope.flag)
                    // change_pourcent_in_watchlist(i,the_symbol,type)
                    return;
                }
            }
        }
    }

    bar_sentiment_for_add_in_watchlist = function(index,the_symbol,type,flag){
        //console.log("in fct 2",index,the_symbol,type,$scope.all_sentiments,$scope.all_sentiments[the_symbol])
        if($scope.all_sentiments.hasOwnProperty(the_symbol)){
            // console.log("if")
            if(!flag){
                if(type == 'BULLISH') {
                    $scope.all_sentiments[the_symbol].BULLISH =
                        Number($scope.all_sentiments[the_symbol].BULLISH + 1);
                }
                else {
                    $scope.all_sentiments[the_symbol].BEARISH =
                        Number($scope.all_sentiments[the_symbol].BEARISH + 1);
                }
            }

            if( Number($scope.all_sentiments[the_symbol].BULLISH) >=
                Number($scope.all_sentiments[the_symbol].BEARISH) ){
                $scope.WatchlistTable[index].more_bullish = true
            }
            else {
                $scope.WatchlistTable[index].more_bullish = false
            }
            //console.log("if",$scope.all_sentiments[the_symbol])
        }
        else{
            if(type == 'BULLISH'){
                $scope.all_sentiments[the_symbol] = {BEARISH:0,BULLISH:1}
                $scope.WatchlistTable[index].more_bullish = true
            }
            else{
                $scope.all_sentiments[the_symbol] = {BEARISH:1,BULLISH:0}
                $scope.WatchlistTable[index].more_bullish = false
            }
        }

        $scope.max_sentiment_for_addWt = Math.max($scope.all_sentiments[the_symbol].BEARISH,
            $scope.all_sentiments[the_symbol].BULLISH)

        var sent=($scope.max_sentiment_for_addWt / ($scope.all_sentiments[the_symbol].BEARISH +
            $scope.all_sentiments[the_symbol].BULLISH)) *100

        $scope.WatchlistTable[index].sentiment=Number(sent.toFixed(1))
        // console.log("index2",$scope.all_stock_sentiments[the_symbol])

        //add to filterItem (and ItemDetails)
        if(!flag){
            for(i=0;i<$scope.filteredItems.length;i++){
                if($scope.filteredItems[i].pair == the_symbol){
                    $scope.flag = true
                    bar_sentiment_for_add_in_feed(i,the_symbol,type,$scope.flag)
                    // change_pourcent_in_watchlist(i,the_symbol,type)
                    return;
                }
            }
        }
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
            $scope.no_stock = "no stock for " + $scope.country_name
        }
        // $scope.$apply()
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

stockApp.controller('OpenSentimentCtrl', function($scope, $uibModalInstance, curr) {

    $scope.sentiment_curr = curr.name

    $scope.close = function(){
        $uibModalInstance.close("close");
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss();
    }

});


var dvStock = document.getElementById('dvStock');

angular.element(document).ready(function() {

    angular.bootstrap(dvStock, ['stockApp']);
});
