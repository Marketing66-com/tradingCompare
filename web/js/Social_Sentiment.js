var Social_Sentiment_Ctrl = angular.module('Social_Sentiment_Ctrl', ['ui.bootstrap', 'memberService','watchlistService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

Social_Sentiment_Ctrl.controller("Social_Sentiment_Ctrl", function ($scope,$http,$location,$window,MemberService,WatchlistService,$timeout) {

    $scope.sentStock = []; $scope.sentCrypto = []; $scope.sentForex = [];
    $scope.sent={};
    $scope.sentarray=[];$scope.sentarray1=[];$scope.sentarray2=[];
    $scope.strStock = "";  $scope.strCrypto = "";  $scope.strForex = ""
    $scope.listTemp =[] ;
    $scope.MyPercent;$scope.Id
    $scope.Havepercent=false;

    $scope.init = function () {
    $scope.spinner = true

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $scope.userLoggedIn = true;
            //console.log("getuser",user)
            user.getIdToken(true).then(function (idToken) {
                console.log("getIdToken")
                 $scope.idToken = idToken
                })
                .then(() => {
                        $scope._id = {
                            _id: user.uid
                        }

                            $http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiments-by-user/"+user.uid)
                                .then(function (result) {
                                    $scope.sentiment= result.data;
                                    for (var i =0;i<$scope.sentiment.length;i++) {

                                        if ($scope.sentiment[i].symbol_type == "STOCK") {
                                            $scope.sentStock.push($scope.sentiment[i].symbol)
                                            $scope.strStock += $scope.sentiment[i].symbol + ","
                                            $scope.sent[$scope.sentiment[i].symbol] = $scope.sentiment[i]

                                        }
                                        else if ($scope.sentiment[i].symbol_type == "CRYPTO") {
                                            $scope.sentCrypto.push($scope.sentiment[i].symbol)
                                            $scope.strCrypto += $scope.sentiment[i].symbol + ","
                                            $scope.sent[$scope.sentiment[i].symbol] = $scope.sentiment[i]

                                        }
                                        else if ($scope.sentiment[i].symbol_type == "FOREX") {
                                            $scope.sentForex.push($scope.sentiment[i].symbol)
                                            $scope.strForex += $scope.sentiment[i].symbol + ","
                                            $scope.sent[$scope.sentiment[i].symbol] = $scope.sentiment[i]

                                        }
                                        $scope.sent[$scope.sentiment[i].symbol].bearishOpen = false
                                        $scope.sent[$scope.sentiment[i].symbol].bullishOpen = false
                                        $scope.sent[$scope.sentiment[i].symbol].bearishClose = false
                                        $scope.sent[$scope.sentiment[i].symbol].bullishClose = false

                                        if ($scope.sentiment[i].type == "BEARISH") {
                                            if ($scope.sentiment[i].status == "OPEN") {
                                                $scope.sent[$scope.sentiment[i].symbol].bearishOpen = true;
                                            }
                                            if ($scope.sentiment[i].status == "CLOSE") {
                                                $scope.sent[$scope.sentiment[i].symbol].bearishClose = true;
                                            }
                                        }
                                        if ($scope.sentiment[i].type == "BULLISH") {
                                            if ($scope.sentiment[i].status == "OPEN") {
                                                $scope.sent[$scope.sentiment[i].symbol].bullishOpen = true;
                                            }
                                            if ($scope.sentiment[i].status == "CLOSE") {
                                                $scope.sent[$scope.sentiment[i].symbol].bullishClose = true;
                                            }
                                        }

                                        //date
                                        var mydate = new Date($scope.sent[$scope.sentiment[i].symbol].date);
                                        var strDate= mydate.toString().split(" ")
                                        var myDate= strDate[1]+" "+strDate[2]+","+strDate[3]
                                        $scope.sent[$scope.sentiment[i].symbol].myDate=myDate

                                        if($scope.sentiment[i].status == "CLOSE") {
                                            var mydate = new Date($scope.sent[$scope.sentiment[i].symbol].close_date);
                                            var strDate = mydate.toString().split(" ")
                                            var myDate = strDate[1] + " " + strDate[2] + "," + strDate[3]
                                            $scope.sent[$scope.sentiment[i].symbol].close_date = myDate
                                        }
                                    }

                                    // console.log("sentiments",$scope.sent)

                                })

                                .catch(function (error) {
                                    $scope.data = error;
                                    console.log("error", $scope.data)
                                    $scope.$apply();
                                })
                                .then(() => {
                                    BuildSentimentlist()
                                })
                                .then(()=>{

                                    var check = function() {
                                        if(  $scope.sentiment_list == true && $scope.leaderbord_list == true) {
                                            $scope.spinner = false
                                        }
                                        else{
                                            // console.log("wait for, watchlist")
                                            $timeout(check, 100);
                                        }
                                    }
                                    $timeout(check, 100)
                                })

                })
                .catch(function (error) {
                        $scope.data = error;
                        console.log("$scope.data", $scope.data)
                        $scope.$apply();
                })
            // $scope.$apply();
        }
        else{
            $scope.userLoggedIn = false;
            // console.log("no user")
            // var url =  decodeURIComponent(Routing.generate('Live_rates_stocks', { 'name': 'United-States','value':'united-states-of-america'}))
            // $window.location= url
            $scope.$apply();
        }
///////////////////////////////////////////leaderboard////////////////////////////////////////////////////////////

        $http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiments-leaderboard")
            .then(function (result) {
                if (result.data.length>10){
                    $scope.leaderbord=result.data.slice(0,10)
                    $scope.leaderEnd=result.data.slice(10)
                }
                else
                    $scope.leaderbord= result.data;

                result.data.forEach(element => {
                    if(element._id == user.uid){
                        $scope.MyPercent= element.total_corect_percent
                        $scope.Havepercent=true
                    }
                })
                // console.log("leaderbord",$scope.MyPercent, $scope.Havepercent)

            })
            .then(()=>{
                $scope.leaderbord_list = true
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("error", $scope.data)
                $scope.$apply();
            })
    })

    }
    ///////////////////////////////////////////////////////////////////////////////////////

    BuildSentimentlist = function() {

        var promises1 = WatchlistService.cryptoForWatchlist($scope.sentCrypto, $scope.strCrypto)
        var promises2 = WatchlistService.forexForWatchlist($scope.sentForex, $scope.strForex)

        var all_promises = [promises1, promises2]

        $scope.sentStock.forEach(element => {
            all_promises.push(WatchlistService.stockForWatchlist(element))
        })

        Promise.all(all_promises).then((Arrays) => {
            // console.log("Arrays", Arrays)
            $scope.listTemp = Arrays[0].concat(Arrays[1])
            for (i = 2; i < Arrays.length; i++) {
                $scope.listTemp.push(Arrays[i])
            }
            // console.log("listTemp",$scope.listTemp )
            for(var j=0;j<$scope.listTemp.length;j++) {

                $scope.sent[$scope.listTemp[j].pair].name = $scope.listTemp[j].name;
                $scope.sent[$scope.listTemp[j].pair].change24 = $scope.listTemp[j].change24;
                $scope.sent[$scope.listTemp[j].pair].img = $scope.listTemp[j].img;
            }
            // console.log("sentiments",$scope.sent)
           for (var element in $scope.sent){
                if($scope.sent[element].status=="OPEN") {
                    $scope.sentarray1.push($scope.sent[element])
                }
                else if($scope.sent[element].status=="CLOSE") {
                    $scope.sentarray2.push($scope.sent[element])
                }
           }
           $scope.sentarray= $scope.sentarray1.concat($scope.sentarray2)
            // console.log("sentiments",$scope.sentarray)

            $scope.sentiment_list = true
            $scope.$apply()

        })
    }
    ///////////////////////close////////////////////////////////////////////////////////
    //"/close-sentiment"

    $scope.close_sentiment = function(item) {
        
        $scope.sent[item.symbol].bearishOpen = false
        $scope.sent[item.symbol].bullishOpen = false

        if (item.type == "BEARISH") {
            $scope.sent[item.symbol].bearishClose = true;
        }

        if (item.type == "BULLISH") {
            $scope.sent[item.symbol].bullishClose = true;
        }
        var promise1 = new Promise(function(resolve, reject) {
                    switch (item.symbol_type) {
             case "STOCK":
                 $http.get("https://websocket-stock.herokuapp.com/Getstocks/" + item.symbol)
                     .then(function (response) {
                         $scope.closePrice = response.data.price
                         $scope.sent[item.symbol].close_price =  $scope.closePrice

                         //date
                         var mydate = new Date();
                         var strDate= mydate.toString().split(" ")
                         var myDate= strDate[1]+" "+strDate[2]+","+strDate[3]
                         $scope.sent[item.symbol].close_date=myDate


                         resolve($scope.closePrice);
                     })
                 break;
             case "CRYPTO":
                 $http.get("https://crypto.tradingcompare.com/AllPairs/" + item.symbol)
                     .then(function (response) {
                         $scope.closePrice = response.data.price
                         $scope.sent[item.symbol].close_price =  $scope.closePrice
                         //date
                         var mydate = new Date();
                         var strDate= mydate.toString().split(" ")
                         var myDate= strDate[1]+" "+strDate[2]+","+strDate[3]
                         $scope.sent[item.symbol].close_date=myDate
                         resolve($scope.closePrice);
                     })
                 break;
             case "FOREX":
                 $http.get("https://forex.tradingcompare.com/all_data/" + item.symbol)
                     .then(function (response) {
                         $scope.closePrice = response.data.price
                         $scope.sent[item.symbol].close_price =  $scope.closePrice
                         //date
                         var mydate = new Date();
                         var strDate= mydate.toString().split(" ")
                         var myDate= strDate[1]+" "+strDate[2]+","+strDate[3]
                         $scope.sent[item.symbol].close_date=myDate
                         resolve($scope.closePrice);
                     })
                 break;
         }


        });


        promise1.then(function(value) {
            // console.log(value);
            console.log("hello", $scope.sent);

            for (var i=0; i<$scope.sentarray1.length;i++) {
                if($scope.sentarray1[i].symbol==$scope.sent[item.symbol].symbol) {
                    $scope.sentarray1.splice(i,1)
                    $scope.sentarray2.push($scope.sent[item.symbol])
                }
            }
           $scope.sentarray= $scope.sentarray1.concat($scope.sentarray2)
            $scope.$apply();

        $scope.data_to_send ={
            _id: item.user_id,
            symbol:item.symbol,
            symbol_type: item.symbol_type,
            close_price: value
        }

         // console.log($scope.data_to_send)

        MemberService.Close_sentiment($scope.idToken, $scope.data_to_send).then(function (results) {
            // console.log("results",results.data, $scope.data_to_send)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    })
    }
    $scope.clickid= function(id) {
        console.log('in click')
        if(id==$scope._id._id){
            $('body').append($('<form/>', {
                id: 'form',
                method: 'POST',
                action: Routing.generate('my-profile')
            }));
        }
        else {
            $('body').append($('<form/>', {
                id: 'form',
                method: 'POST',
                action: Routing.generate('profile')
            }));
        }
        $('#form').append($('<input/>', {
            type: 'hidden',
            name: 'client_id',
            value: id
        }));

        $('#form').submit();
    }
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
        // console.log("currency",symbol, "name",name, "_locale",_locale)

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
})

var dvSocialSentiment = document.getElementById('dvSocialSentiment');

angular.element(document).ready(function() {

    angular.bootstrap(dvSocialSentiment, ['Social_Sentiment_Ctrl']);
});
