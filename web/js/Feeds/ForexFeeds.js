var ForexApp = angular.module('ForexApp', ['ui.bootstrap','memberService','watchlistService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

ForexApp.controller("ForexController", function ($scope,$window,$location,MemberService,WatchlistService,$http,$interval,$timeout,$uibModal) {

    let itemsDetails = [];
    $scope.maxSize = 5;

    $scope.currentPage = 1;
    $scope.totalItems = function () {
        return itemsDetails.length;
    };
    $scope.itemsPerPage = 100;

    $scope.result = [];

    $scope.Wstock = []; $scope.Wcrypto =[]; $scope.Wforex = []
    $scope.strStock = "";  $scope.strCrypto = "";  $scope.strForex = ""

    $scope.WatchlistTemp =[] ;$scope.WatchlistTable =[]

    $scope.user_sentiments=[]
    $scope.for_finished = false

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.filteredItems = itemsDetails.slice(begin, end);
        $scope.Wforex.forEach(currencie => {
            $scope.filteredItems.forEach(element =>     {
                if(currencie == element.pair){
                    //console.log("pageChanged",currencie,element.pair,element)
                    element.is_in_watchlist = true
                }
            });
        });
        $(document).scrollTop(0);
    };

    $scope.init = function () {
        $scope.spinner = true

        this.items = itemsDetails;

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $scope.userLoggedIn = true;
                console.log("getuser")
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
                        }
                        $scope.$apply();
                    }).then(() => {
                        MemberService.getSentimentsByUser($scope.idToken).then(function (results) {
                            console.log("getSentimentsByUser")
                            $scope.user_sentiments = results
                            $scope.$apply();
                        })
                        .then(()=>{
                            if($scope.for_finished == true){
                                //console.log("for finished, sentiment")
                                if($scope.user_sentiments.length>0) {
                                    $scope.user_sentiments.forEach(element => {
                                        if (element.symbol_type == 'FOREX' && element.status == 'OPEN') {
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
                                                if (element.symbol_type == 'FOREX' && element.status == 'OPEN') {
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
                        }).catch(function (error) {
                            $scope.data = error;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })
                    })
                    .then(() => {
                            if($scope.for_finished == true){
                               // console.log("for finished")
                                if($scope.Wforex.length>0){
                                    $scope.Wforex.forEach(currencie => {
                                        $scope.filteredItems.forEach(element =>     {
                                            if(currencie == element.pair){
                                                element.is_in_watchlist = true
                                                $scope.$apply();
                                            }
                                        });
                                        $scope.user_watchlist_finished = true
                                    });
                                }
                                else{
                                    $scope.user_watchlist_finished = true
                                }
                                // if($scope.user_sentiments.length>0) {
                                //     $scope.user_sentiments.forEach(element => {
                                //         if (element.symbol_type == 'STOCK' && element.status == 'OPEN') {
                                //             $scope.filteredItems.forEach(element_table => {
                                //                 if (element.symbol == element_table.pair) {
                                //                     element_table.status_sentiment = 'OPEN'
                                //                     element_table.type_sentiment = element.type
                                //                 }
                                //             });
                                //         }
                                //     });
                                // }
                            }
                            else{
                                var check = function() {
                                    // console.log("in timeout",$scope.for_finished)
                                    if($scope.for_finished == false) {
                                        console.log("wait for")
                                        $timeout(check, 100);
                                    }
                                    else{
                                        if($scope.Wforex.length>0){
                                            $scope.Wforex.forEach(currencie => {
                                                $scope.filteredItems.forEach(element =>     {
                                                    if(currencie == element.pair){
                                                        console.log("***",currencie,element.pair,element)
                                                        element.is_in_watchlist = true
                                                        $scope.$apply();
                                                    }
                                                });
                                                $scope.user_watchlist_finished = true
                                            });
                                        }
                                        else{
                                            $scope.user_watchlist_finished = true
                                        }
                                        // if($scope.user_sentiments.length>0) {
                                        //     $scope.user_sentiments.forEach(element => {
                                        //         if (element.symbol_type == 'STOCK' && element.status == 'OPEN') {
                                        //             $scope.filteredItems.forEach(element_table => {
                                        //                 if (element.symbol == element_table.pair) {
                                        //                     element_table.status_sentiment = 'OPEN'
                                        //                     element_table.type_sentiment = element.type
                                        //                 }
                                        //             });
                                        //
                                        //         }
                                        //     });
                                        // }
                                    }
                                }
                                $timeout(check, 100)
                                $scope.$apply();
                            }
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
                $scope.$apply();
            }
        });
        //*****************************************************
        $http.get("https://forex.tradingcompare.com/all_data")
            .then(function(result) {
                $scope.result = result.data;
               // console.log("$scope.result",$scope.result)
                $http.post("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiment-by-type/",{symbol_type: 'FOREX'})
                    .then(function(response) {
                        $scope.all_forex_sentiments = response.data
                        //console.log("all_forex_sentiments",$scope.all_forex_sentiments)
                    })
                    .then(function() {
                        var i = 0
                        for (const key in $scope.result) {
                            if ($scope.result.hasOwnProperty(key)) {

                                itemsDetails[i] = $scope.result[key];
                                itemsDetails[i].type = 'FOREX'

                                //NAME
                                itemsDetails[i].complete_name = itemsDetails[i].name

                                //IMAGE
                                if($scope.result[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
                                    $scope.result[key].img == undefined
                                    || typeof $scope.result[key].img== "undefined"){

                                    itemsDetails[i].img =  "/img/Stock_Logos/stocks.png"
                                }

                                // SENTIMENT
                                if($scope.all_forex_sentiments.hasOwnProperty($scope.result[key].pair)){
                                    if( Number($scope.all_forex_sentiments[$scope.result[key].pair].BULLISH) >=
                                        Number($scope.all_forex_sentiments[$scope.result[key].pair].BEARISH) ){
                                        itemsDetails[i].more_bullish = true
                                    }
                                    else {
                                        itemsDetails[i].more_bullish = false
                                    }

                                    $scope.max_sentiment = Math.max($scope.all_forex_sentiments[$scope.result[key].pair].BEARISH, $scope.all_forex_sentiments[$scope.result[key].pair].BULLISH)
                                    var sent=($scope.max_sentiment / ($scope.all_forex_sentiments[$scope.result[key].pair].BEARISH + $scope.all_forex_sentiments[$scope.result[key].pair].BULLISH)) *100
                                }
                                else{
                                    var sent = 50
                                    itemsDetails[i].more_bullish = true
                                }
                                itemsDetails[i].sentiment=Number(sent.toFixed(1))

                                //SENTIMENT USER
                                itemsDetails[i].status_sentiment = 'CLOSE'
                                itemsDetails[i].type_sentiment = 'none'

                                //WATCHLIST
                                itemsDetails[i].is_in_watchlist = false

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
                        console.log("error", $scope.data)
                        $scope.$apply();
                    })
            })
            .catch(function (error) {
                        $scope.data = error;
                        console.log("error", $scope.data)
                        $scope.$apply();
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

        $http.post("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiment-by-type/",{symbol_type: 'STOCK'})
            .then(function(response) {
                //console.log(response.data)
                $scope.all_stock_sentiments = response.data
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("error", $scope.data)
                // $scope.$apply();
            })

        // ***************************************************************

        $scope.getDisplayValue = function(currentValue)
        {
            return intFormat(currentValue);
        }
    }

    $scope.delete_from_watchlist_inW = function(index,type) {
        // console.log("index",index)
        // console.log("$scope.WatchlistTable",$scope.WatchlistTable[index])
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

        for(i=0;i<$scope.Wforex.length;i++){
            if($scope.Wforex[i] == $scope.stock_to_delete){
                $scope.Wforex.splice(i, 1)
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
        if($scope.user.phone_number == ""){
            $('.modal_sigh-up').slideDown();
            return;
        }
        if(!$scope.user.verifyData.is_phone_number_verified){
            $('.modal_sigh-up').slideDown();
            return;
        }

        $scope.filteredItems[index].is_in_watchlist = false

        for(i=0;i<$scope.WatchlistTable.length;i++){
            if($scope.WatchlistTable[i].pair == $scope.filteredItems[index].pair){
                $scope.WatchlistTable.splice(i, 1)
            }
        }
        for(j=0;j<$scope.Wforex.length;j++){
            if($scope.Wforex[j] == $scope.filteredItems[index].pair){
                $scope.Wforex.splice(j, 1)
            }
        }
        // console.log("$scope.WatchlistTable after",$scope.WatchlistTable)
        // console.log("$scope.Wstock after",$scope.Wstock)

        $scope.data_to_send ={
            data: { symbol:$scope.filteredItems[index].pair,
                type:"FOREX"
            },
            _id: $scope.user._id
        }

        MemberService.Delete_from_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
           // console.log("delete",results)
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
        $scope.Wforex.push($scope.filteredItems[index].pair)

        $scope.data_to_send ={
            data: { symbol:$scope.filteredItems[index].pair,
                type:"FOREX"
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

    // ***** SENTIMENTS *****
    $scope.add_sentiment = function(index, type) {
        var the_symbol = $scope.filteredItems[index].pair
        // console.log("index",index, type,$scope.filteredItems[index])
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
        var the_symbol = $scope.WatchlistTable[index].pair
        //console.log("index",index, type,$scope.filteredItems[index])
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
        $scope.WatchlistTable[index].status_sentiment =  'OPEN'
        $scope.WatchlistTable[index].type_sentiment =  type

        //add to watchlist
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
            // var url =  Routing.generate('template',{"_locale": _locale })
            var url =  Routing.generate('template')
            // console.log("url",url)
            $window.location= url
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


        Promise.all(all_promises) .then((Arrays) => {
            //console.log("Arrays", Arrays)
            $scope.WatchlistTemp = Arrays[0].concat(Arrays[1])
            for (i = 2; i < Arrays.length; i++) {
                $scope.WatchlistTemp.push(Arrays[i])
            }
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
                if ( $scope.all_forex_sentiments == undefined || $scope.all_crypto_sentiments == undefined || $scope.all_stock_sentiments == undefined) {
                    console.log("forex sentiment undefined")
                    $timeout(check, 100)
                }
                else {
                    $scope.all_sentiments = Object.assign({}, $scope.all_forex_sentiments, $scope.all_crypto_sentiments, $scope.all_stock_sentiments);
                    //console.log("all_sentiments", $scope.all_sentiments)

                    for(i=0;i<$scope.WatchlistTable.length;i++) {
                        if ($scope.all_sentiments.hasOwnProperty($scope.WatchlistTable[i].pair)) {
                            if($scope.all_sentiments[$scope.WatchlistTable[i].pair].BULLISH >=
                                $scope.all_sentiments[$scope.WatchlistTable[i].pair].BEARISH ){
                                $scope.WatchlistTable[i].more_bullish = true
                            }
                            else{
                                $scope.WatchlistTable[i].more_bullish = false
                            }
                            $scope.max_sentiment = Math.max($scope.all_sentiments[$scope.WatchlistTable[i].pair].BEARISH,
                                $scope.all_sentiments[$scope.WatchlistTable[i].pair].BULLISH)
                            $scope.WatchlistTable[i].sentiment = Number((($scope.max_sentiment /
                                ($scope.all_sentiments[$scope.WatchlistTable[i].pair].BEARISH +
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
        if($scope.all_forex_sentiments.hasOwnProperty(the_symbol)){
            if(!flag){
                if(type == 'BULLISH') {
                    $scope.all_forex_sentiments[the_symbol].BULLISH =
                        Number($scope.all_forex_sentiments[the_symbol].BULLISH + 1);
                }
                else {
                    $scope.all_forex_sentiments[the_symbol].BEARISH =
                        Number($scope.all_forex_sentiments[the_symbol].BEARISH + 1);
                }
            }

            if( Number($scope.all_forex_sentiments[the_symbol].BULLISH) >=
                Number($scope.all_forex_sentiments[the_symbol].BEARISH) ){
                $scope.filteredItems[index].more_bullish = true
            }
            else {
                $scope.filteredItems[index].more_bullish = false
            }
        }
        else{
            if(type == 'BULLISH'){
                $scope.all_forex_sentiments[the_symbol] = {BEARISH:0,BULLISH:1}
                $scope.filteredItems[index].more_bullish = true
            }
            else{
                $scope.all_forex_sentiments[the_symbol] = {BEARISH:1,BULLISH:0}
                $scope.filteredItems[index].more_bullish = false
            }
        }

        $scope.max_sentiment_for_add = Math.max($scope.all_forex_sentiments[the_symbol].BEARISH,
            $scope.all_forex_sentiments[the_symbol].BULLISH)

        var sent=($scope.max_sentiment_for_add / ($scope.all_forex_sentiments[the_symbol].BEARISH +
            $scope.all_forex_sentiments[the_symbol].BULLISH)) *100

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
        $scope.$apply()
    })

    $scope.ActiveChange = function (symbol,name, _locale) {

        var from = symbol.slice(0, 3)
        var to = symbol.slice(3, 6)
        symbol = from + "-" + to
       // console.log("symbol",symbol, _locale)
        var url =  Routing.generate('forex_chart',{"currency" :symbol, "_locale": _locale})
      // console.log(Routing.generate('forex_chart',{"currency" :symbol, "_locale": _locale}))
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
                if(name.indexOf(' ') > -1)
                    name = name.replace(/ /g, '-')

                var url =  decodeURIComponent(Routing.generate('crypto_chart',{"currency" :symbol, "name" :name, "_locale": _locale}))
                //console.log(Routing.generate('crypto_chart',{"currency" : symbol, "name" :name, "_locale": _locale}))
                $window.location= url
                break;

            case "FOREX":
                $scope.ActiveChange(symbol, name, _locale)
                break;

            default:
                break;
        }
    }

});

ForexApp.controller('OpenSentimentCtrl', function($scope, $uibModalInstance, curr) {

    $scope.sentiment_curr = curr.name

    $scope.ok = function(){
        $uibModalInstance.close("Ok");
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss();
    }

});


    var dvForex = document.getElementById('dvForex');

    angular.element(document).ready(function() {

        angular.bootstrap(dvForex, ['ForexApp']);
    });


    //*********************************************************
// currencies
// $.ajax({
//     url: "https://forex.tradingcompare.com/all_data",
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
//                 itemsDetails[i].complete_name = itemsDetails[i].name
//
//                 //IMAGE
//                 if($scope.result[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png"||
//                     $scope.result[key].img == undefined
//                     || typeof $scope.result[key].img== "undefined"){
//
//                     itemsDetails[i].img =  "/img/Stock_Logos/stocks.png"
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
//     },
//     error: function (xhr, ajaxOptions, thrownError) {
//         console.log("ERROR", thrownError, xhr, ajaxOptions)
//     }
// });