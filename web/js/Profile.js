var ProfileApp = angular.module('ProfileApp', ['ui.bootstrap', 'memberService','watchlistService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

ProfileApp.controller('ProfileController', function($scope,$window,$location,$http,MemberService,WatchlistService, $interval,$timeout,$uibModal) {
    $scope.init = function (Other_id) {
        console.log('id********', Other_id)
        $scope.tab = 1;

        $scope.setTab = function (newTab) {
            $scope.tab = newTab;
        };

        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };

        $scope.Other_id = {_id: Other_id}
        $scope.other_Sentiments = []
/////////Tab2 watchlist//////////////////
        $scope.WStock = [];
        $scope.WCrypto = [];
        $scope.WForex = [];
        $scope.strWStock = "";
        $scope.strWCrypto = "";
        $scope.strWForex = ""
        $scope.WatchlistTemp = [];
        $scope.WatchlistTable = []
        $scope.isInMyWL = [];
        $scope.user_sentiments = [];

//////// tab3 following/////////////////

        $scope.get_following = []

///////tab5 sentimemt//////////////////
        $scope.sentarray=[];$scope.sentarray1=[];$scope.sentarray2=[];

        $scope.sentStock = [];
        $scope.sentCrypto = [];
        $scope.sentForex = [];
        $scope.sent = {};
        $scope.strStock = "";
        $scope.strCrypto = "";
        $scope.strForex = ""
        $scope.listTemp = [];
        $scope.MyPercent;
        $scope.Id
        $scope.Havepercent = false;


        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $scope.userLoggedIn = true;
                //console.log("getuser",user)
                user.getIdToken(true).then(function (idToken) {
                    // console.log("getIdToken")
                    $scope.idToken = idToken
                    $scope._id = {
                        _id: user.uid
                    }

                    MemberService.createOtherUser($scope.Other_id).then(function (results) {
                        console.log("$scope.other_User", results.data)
                        $scope.other_User = results.data
                        if($scope.other_User.full_name == undefined){
                            $scope.other_User.full_name=   $scope.other_User.first_name + " "+$scope.other_User.last_name
                        }
                        $scope.other_User.mycountry=$scope.other_User.countryData.country.toLowerCase().replace(/\s+$/, '').replace(' ','-')
                    })
                        .catch(function (error) {
                            console.log('ERROR: ', error)
                            $scope.$apply();
                        })
                    /***************/
                        .then(() => {
                    MemberService.getUsersById($scope.idToken, $scope._id).then(function (results) {
                        console.log("getUsersById", results.data)
                        $scope.user = results.data
                    })

                        .then(() => {
                            var promises1 = BuildPost()
                            var promises2 = BuildWatchlist()
                            var promises3 = BuildFollowing()
                            var promises4 = BuildFollower()
                            var promises5 = BuildSentiments()

                            var all_promises = [promises1, promises2, promises3, promises4, promises5]

                            Promise.all(all_promises).then((Arrays) => {

                                console.log("get in !!!!!")
                            })
                                .catch(function (error) {
                                console.log('ERROR: ', error)
                                $scope.$apply();
                            })
                        })

                        .catch(function (error) {
                            $scope.data = error;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })

                        })

                        .catch(function (error) {
                            $scope.data = error;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })
                        /***************/



                    MemberService.getOtherFollowing($scope.Other_id._id).then(function (results) {
                        // console.log("Other_following", results)
                        $scope.other_following = results
                    })
                        .catch(function (error) {
                            console.log('ERROR: ', error)
                            $scope.$apply();
                        });

                    MemberService.getOtherFollowers($scope.Other_id._id).then(function (results) {
                        // console.log("Other_followers", results)
                        $scope.other_followers = results
                    })
                        .catch(function (error) {
                            console.log('ERROR: ', error)
                            $scope.$apply();
                        });

                    MemberService.getOtherComments($scope.Other_id._id).then(function (results) {
                        // console.log("Other_Comments", results)
                        $scope.other_Comments = results
                    })
                        .catch(function (error) {
                            console.log('ERROR: ', error)
                            $scope.$apply();
                        })

                    MemberService.getOtherSentiments($scope.Other_id._id).then(function (results) {
                        // console.log("Other_Sentiments", results)
                        $scope.other_Sentiments = results
                    }).catch(function (error) {
                        console.log('ERROR: ', error)
                        $scope.$apply();
                    })



                    MemberService.getSentimentsByUser($scope.idToken, $scope._id).then(function (results) {
                        // console.log("getSentimentsByUser",results)
                        $scope.user_sentiments = results
                        // $scope.user_sentiments = results
                        $scope.$apply();
                    })
                        .catch(function (error) {
                            console.log('ERROR: ', error)
                            $scope.$apply();
                        })

                    MemberService.getFollowingOfUser($scope.idToken).then(function (results) {
                        $scope.get_following = results
                        // console.log($scope.get_following)

                    }).catch(function (error) {
                        console.log('ERROR: ', error)
                        $scope.$apply();
                    })

                    MemberService.getFollowers($scope.idToken).then(function (results) {
                        $scope.get_followers = results
                        // $scope.got_followers_flag = true
                        // console.log("get_followers",$scope.get_followers)
                    })
                        .catch(function (error) {
                            console.log('ERROR: ', error)
                            $scope.$apply();
                        })

                    MemberService.getCommentsByID($scope.idToken).then(function (results) {
                        $scope.get_MyComments = results
                        // $scope.got_followers_flag = true
                        // console.log("get_MyComments",$scope.get_MyComments)
                    }) .catch(function (error) {
                        console.log('ERROR: ', error)
                        $scope.$apply();
                    })

                })
                    .catch(function (error) {
                        console.log('ERROR: ', error)
                        $scope.$apply();
                    });
            }
            else {
                $scope.userLoggedIn = false;
                console.log("no user")
                $scope.$apply();
            }
        })
    }

///////////////////////////////////tab0////////////////////////////////////////////////////
// for(var i=0;i<$scope.get_following.length;i++){
//     $scope.Following=false;
//     console.log($scope.get_following,"****",$scope.other_User._id)
//     if($scope.get_following[i]._id==$scope.other_User._id){
//             $scope.Following=true;
//         }
//
// }

///////////////////////////////////tab1 ////////////////////////////////////////////////////
    BuildPost= function() {
        return new Promise(function (resolve, reject) {
            for(var i=0;i<$scope.get_following.length;i++){
                $scope.Following=false;
                if($scope.get_following[i]._id==$scope.other_User._id){
                    $scope.Following=true;
                }
            }
            $scope.$apply();
            resolve($scope.other_Comments)
        })
    }



    $scope.add_Following = function() {
        //console.log('index',index, $scope.Users[index])
        if ($scope.other_User == undefined || $scope.user == undefined) {
            return;
        }
        $scope.Following = true

        $scope.follow = {
            id_following: $scope.user._id,
            id_followed: $scope.other_User._id,
            nickname_following: $scope.user.nickname,
            nickname_followed: $scope.other_User.nickname,
            country_following: $scope.user.countryData.country,
            country_followed: $scope.other_User.countryData.country,
            idToken: $scope.idToken
        }

        $scope.get_following.push({
            _id: $scope.other_User._id,
            nickname: $scope.other_User.nickname,
            country: $scope.other_User.country,

        })

        // for(i=0;i<$scope.other_followers.length;i++){
        //     if($scope.other_followers[i]._id == $scope.other_following[index]._id){
        //         // $scope.get_following.splice(i, 1)
        //         $scope.other_followers[i].myFollow = true
        //
        //     }
        // }
        //console.log('FOLLOW',$scope.follow,$scope.get_following)

        MemberService.Add_follow($scope.idToken, $scope.follow).then(function (results) {
            console.log("add-follow11", results)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    };

    $scope.remove_Following = function(index) {
        //console.log('index',index,$scope.Users[index])

        if($scope.other_User== undefined || $scope.user == undefined){
            return;
        }

        $scope.Following = false

        $scope.follow = {
            id_following: $scope.user._id,
            id_followed: $scope.other_User._id,
            idToken: $scope.idToken
        }

        for(j=0;j<$scope.get_following.length;j++){
            if($scope.get_following[j]._id == $scope.other_User._id) {
                $scope.get_following.splice(j, 1)
            }
        }


        MemberService.Remove_follow($scope.idToken, $scope.follow).then(function (results) {
            console.log("remove-following",results)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    };
///////////////////////////////////end tab1////////////////////////////////////////////////////


///////////////////////////////////tab2 Watchlist////////////////////////////////////////////////////

    BuildWatchlist = function() {
        return new Promise(function (resolve, reject) {

            if ($scope.other_User.watchlist.length > 0) {
                //console.log("in if watchlist.lenght>0")
                $scope.other_User.watchlist.forEach(currencie => {
                    if (currencie.type == 'STOCK') {
                        $scope.WStock.push(currencie.symbol)
                        $scope.strWStock += currencie.symbol + ","
                    }
                    if (currencie.type == 'CRYPTO') {
                        $scope.WCrypto.push(currencie.symbol)
                        $scope.strWCrypto += currencie.symbol + ","
                    }
                    if (currencie.type == 'FOREX') {
                        $scope.WForex.push(currencie.symbol)
                        $scope.strWForex += currencie.symbol + ","
                    }

                });
                var promise1 = BuildWatchlist1()
                promise1.then(function (value) {
                    $scope.$apply();
                    resolve(value)
                })

            }
            else{
                $scope.$apply();
                resolve()
            }

        })
    }
    BuildWatchlist1 = function(){
        return new Promise(function (resolve, reject) {

            //console.log("in fill watchlist")

            var promises1 = WatchlistService.cryptoForWatchlist($scope.WCrypto, $scope.strWCrypto)
            var promises2 = WatchlistService.forexForWatchlist($scope.WForex, $scope.strWForex)

            var all_promises = [promises1, promises2]

            $scope.WStock.forEach(element => {
                all_promises.push(WatchlistService.stockForWatchlist(element))
            })

            Promise.all(all_promises).then((Arrays) => {
                // console.log("Arrays", Arrays)
                $scope.WatchlistTemp = Arrays[0].concat(Arrays[1])
                for (i = 2; i < Arrays.length; i++) {
                    $scope.WatchlistTemp.push(Arrays[i])
                }
                // console.log("WatchlistTemp",$scope.WatchlistTemp )
                $scope.$apply()
            }).then(() => {
                for (i = 0; i < $scope.other_User.watchlist.length; i++) {
                    for (j = 0; j < $scope.WatchlistTemp.length; j++) {
                        if ($scope.other_User.watchlist[i].symbol == $scope.WatchlistTemp[j].pair) {
                            $scope.WatchlistTable.push($scope.WatchlistTemp[j])
                        }
                    }
                }

                for (i = 0; i < $scope.WatchlistTable.length; i++) {
                    $scope.WatchlistTable[i].isInMyWL = false
                    for (j = 0; j < $scope.user_sentiments.length; j++) {
                        if ($scope.WatchlistTable[i].pair == $scope.user_sentiments[j].symbol) {
                            $scope.WatchlistTable[i].status_sentiment = $scope.user_sentiments[j].status
                            $scope.WatchlistTable[i].type_sentiment = $scope.user_sentiments[j].type
                        }
                    }
                    for (j = 0; j < $scope.user.watchlist.length; j++) {
                        if ($scope.WatchlistTable[i].pair == $scope.user.watchlist[j].symbol) {
                            $scope.WatchlistTable[i].isInMyWL = true
                        }
                    }
                }

                // console.log("$scope.WatchlistTable", $scope.WatchlistTable)

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
            resolve($scope.WatchlistTable)


        })
    }

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

    $http.post("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiment-by-type/",{symbol_type: 'STOCK'})
        .then(function(response) {
            //console.log("response from sentiment-by-type",response.data)
            $scope.all_stock_sentiments = response.data
        })
        .catch(function (error) {
            $scope.data = error;
            console.log("error", $scope.data)
            // $scope.$apply();
        })
    // ***************************************************************

    //******  WATCHLIST ************  ADD - DELETE FUNCTIONS ****************///

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

        //delete from watchlist table
                $scope.WatchlistTable[index].isInMyWL = false


        $scope.data_to_send ={
            data: {
                symbol:$scope.WatchlistTable[index].pair,
                type:$scope.WatchlistTable[index].type
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

        if($scope.user.phone_number == ""){
            $('.modal_sigh-up').slideDown();
            return;
        }

        if(!$scope.user.verifyData.is_phone_number_verified){
            $('.modal_sigh-up').slideDown();
            return;
        }

        $scope.WatchlistTable[index].isInMyWL =  true

        $scope.data_to_send ={
            data: { symbol:$scope.WatchlistTable[index].pair,
                    type:$scope.WatchlistTable[index].type
            },
            _id: $scope.user._id
        }
        MemberService.Add_to_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
            console.log("results",results)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    }

///////////////////////////////////////////////////////////////////////////////

    // ***** SENTIMENTS *****
    $scope.add_sentiment = function(index, type) {
        var the_symbol = $scope.WatchlistTable[index].pair
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
        // add
        $scope.WatchlistTable[index].status_sentiment =  'OPEN'
        $scope.WatchlistTable[index].type_sentiment =  type


        //** bar **//
        $scope.flag = false
        bar_sentiment_for_add_in_watchlist (index,the_symbol,type,$scope.flag)
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
            console.log("results",results.data)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    }

    $scope.AlreadyOpen = function(index) {

        if($scope.user_sentiments == undefined) {
            console.log("return")
            return;
        }

            $scope.resolve = {curr:$scope.WatchlistTable[index]}


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

    }

///////////////////end tab2//////////////////////////////////////////////////

//////////////////////////////////tab3 Following////////////////////////////////////////////////////

    BuildFollowing = function() {
        return new Promise(function (resolve, reject) {

            for(i=0;i<$scope.other_following.length; i++){
                $scope.other_following[i].myFollow= false
                $scope.other_following[i].mycountry=$scope.other_following[i].country.toLowerCase().replace(/\s+$/, '').replace(' ','-')
                for(j=0;j<$scope.get_following.length; j++){
                    if($scope.other_following[i]._id==$scope.get_following[j]._id){
                        $scope.other_following[i].myFollow= true
                    }
                }
            }
            $scope.$apply()
            // console.log("*******",$scope.get_following)

            resolve($scope.other_following)
        })
    }

    $scope.add_follow = function(index) {
        //console.log('index',index, $scope.Users[index])
        if($scope.other_following == undefined || $scope.user == undefined){
            return;
        }

        $scope.other_following[index].myFollow = true

        $scope.follow = {
            id_following: $scope.user._id,
            id_followed: $scope.other_following[index]._id,
            nickname_following: $scope.user.nickname,
            nickname_followed: $scope.other_following[index].nickname,
            country_following: $scope.user.countryData.country,
            country_followed: $scope.other_following[index].country,
            idToken: $scope.idToken
        }

        $scope.get_following.push({
            _id: $scope.other_following[index]._id,
            nickname: $scope.other_following[index].nickname,
            country: $scope.other_following[index].country,

        })

        for(i=0;i<$scope.other_followers.length;i++){
            if($scope.other_followers[i]._id == $scope.other_following[index]._id){
                // $scope.get_following.splice(i, 1)
                $scope.other_followers[i].myFollow = true

            }
        }
        //console.log('FOLLOW',$scope.follow,$scope.get_following)

        MemberService.Add_follow( $scope.idToken, $scope.follow).then(function (results) {
            console.log("add-follow",results)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    };

    $scope.remove_follow = function(index) {
        //console.log('index',index,$scope.Users[index])

        if($scope.other_following== undefined || $scope.user == undefined){
            return;
        }

        $scope.other_following[index].myFollow = false

        $scope.follow = {
            id_following: $scope.user._id,
            id_followed: $scope.other_following[index]._id,
            idToken: $scope.idToken
        }

        for(i=0;i<$scope.other_followers.length;i++){
            if($scope.other_followers[i]._id == $scope.other_following[index]._id) {
                $scope.other_followers[i].myFollow = false
            }
        }
        for(j=0;j<$scope.get_following.length;j++){
            if($scope.get_following[j]._id == $scope.other_following[index]._id) {
                $scope.get_following.splice(j, 1)
            }
        }


        MemberService.Remove_follow($scope.idToken, $scope.follow).then(function (results) {
            //console.log("remove-follow",results)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    };

///////////////////end tab3//////////////////////////////////////////////////

///////////////////////////////////tab4 followers////////////////////////////////////////////////////
    BuildFollower = function() {
        return new Promise(function (resolve, reject) {
             for(i=0;i<$scope.other_followers.length; i++){
                 $scope.other_followers[i].myFollow= false
                 $scope.other_followers[i].mycountry=$scope.other_followers[i].country.toLowerCase().replace(/\s+$/, '').replace(' ','-')
                        for(j=0;j<$scope.get_following.length; j++){
                            if($scope.other_followers[i]._id==$scope.get_following[j]._id){
                                $scope.other_followers[i].myFollow= true
                            }
                        }
                    }
                    // console.log("*******",$scope.other_followers)

                    resolve($scope.other_followers)
            $scope.$apply()


        })
    }



    $scope.add_follow_from_followers = function(index) {
        //console.log('index',index, $scope.Users[index])
        if($scope.other_followers == undefined || $scope.user == undefined){
            return;
        }

        $scope.other_followers[index].myFollow = true

        $scope.follow = {
            id_following: $scope.user._id,
            id_followed: $scope.other_followers[index]._id,
            nickname_following: $scope.user.nickname,
            nickname_followed: $scope.other_followers[index].nickname,
            country_following: $scope.user.countryData.country,
            country_followed: $scope.other_followers[index].country,
            idToken: $scope.idToken
        }

        $scope.get_following.push({
            _id: $scope.other_followers[index]._id,
            nickname: $scope.other_followers[index].nickname,
            country: $scope.other_followers[index].country,
            mycountry:$scope.other_followers[index].country.toLowerCase().replace(/\s+$/, '').replace(' ','-'),
            myfollow:$scope.other_followers[index].myFollow
        })

        for(i=0;i<$scope.other_following.length;i++){
            if($scope.other_following[i]._id == $scope.other_followers[index]._id){
                // $scope.get_following.splice(i, 1)
                $scope.other_following[i].myFollow = true

            }
        }
        //console.log('FOLLOW',$scope.follow,$scope.get_following)

        MemberService.Add_follow( $scope.idToken, $scope.follow).then(function (results) {
            //console.log("add-follow",results)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    };

    $scope.remove_follow_from_followers = function(index) {
        //console.log('index',index,$scope.Users[index])

        if($scope.other_followers == undefined || $scope.user == undefined){
            return;
        }

        $scope.other_followers[index].myFollow = false

        $scope.follow = {
            id_following: $scope.user._id,
            id_followed: $scope.other_followers[index]._id,
            idToken: $scope.idToken
        }

        for(i=0;i<$scope.other_following.length;i++){
            if($scope.other_following[i]._id == $scope.other_followers[index]._id){
                $scope.other_following[i].myFollow = false
            }
        }
        for(j=0;j<$scope.get_following.length;j++){
            if($scope.get_following[j]._id == $scope.other_followers[index]._id) {
                $scope.get_following.splice(j, 1)
            }
        }

        MemberService.Remove_follow($scope.idToken, $scope.follow).then(function (results) {
            //console.log("remove-follow",results)
        })
            .catch(function (error) {
                $scope.data = error;
                console.log("$scope.data", $scope.data)
                $scope.$apply();
            })
    };
///////////////////end tab4//////////////////////////////////////////////////

///////////////////////////////////tab5 Sentiments////////////////////////////////////////////////////
    BuildSentiments = function() {
        return new Promise(function (resolve, reject) {
            var promise1 = BuildSentiments1()
            promise1.then(function (value) {
                var promise2 = BuildSentimentlist()
                promise2.then(function (value) {
                    resolve(value)
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
        })
    }

            BuildSentiments1 = function() {
                return new Promise(function (resolve, reject) {
                    $scope.sentiment = $scope.other_Sentiments;
                    // console.log("$scope.sentiment",$scope.sentiment)
                    for (var i = 0; i < $scope.sentiment.length; i++) {

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
                        var strDate = mydate.toString().split(" ")
                        var myDate = strDate[1] + " " + strDate[2] + "," + strDate[3]
                        $scope.sent[$scope.sentiment[i].symbol].myDate = myDate

                        if ($scope.sentiment[i].status == "CLOSE") {
                            var mydate = new Date($scope.sent[$scope.sentiment[i].symbol].close_date);
                            var strDate = mydate.toString().split(" ")
                            var myDate = strDate[1] + " " + strDate[2] + "," + strDate[3]
                            $scope.sent[$scope.sentiment[i].symbol].close_date = myDate
                        }
                    }
                    // console.log("sentiments",$scope.sentCrypto,"sentiments", $scope.sentForex,"sentiments",$scope.sentStock)
                // })
                // .catch(function (error) {
                //     $scope.data = error;
                //     console.log("error", $scope.data)
                //     $scope.$apply();
                // })
            resolve($scope.sent)

        })
    }

    BuildSentimentlist = function() {
        return new Promise(function (resolve, reject) {
            var promises1 = WatchlistService.cryptoForWatchlist($scope.sentCrypto, $scope.strCrypto)
            var promises2 = WatchlistService.forexForWatchlist($scope.sentForex, $scope.strForex)

            var all_promises = [promises1, promises2]

            $scope.sentStock.forEach(element => {
                all_promises.push(WatchlistService.stockForWatchlist(element))
            })

            Promise.all(all_promises).then((Arrays) => {
                $scope.listTemp = Arrays[0].concat(Arrays[1])
                for (i = 2; i < Arrays.length; i++) {
                    $scope.listTemp.push(Arrays[i])
                }

                // console.log("listTemp",$scope.listTemp,"$scope.sent",$scope.sent )
                for (var j = 0; j < $scope.listTemp.length; j++) {
                    for (var k = 0; k < $scope.other_Sentiments.length; k++) {
                        if ($scope.listTemp[j].pair == $scope.other_Sentiments[k].symbol) {
                            $scope.sent[$scope.listTemp[j].pair].name = $scope.listTemp[j].name;
                            $scope.sent[$scope.listTemp[j].pair].change24 = $scope.listTemp[j].change24;
                            $scope.sent[$scope.listTemp[j].pair].img = $scope.listTemp[j].img;
                        }
                    }
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

                // console.log("sentiments",$scope.sent)

                $scope.$apply()
                resolve($scope.sentarray)


            })
        })
    }
///////////////////end tab5//////////////////////////////////////////////////

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

});
ProfileApp.controller('OpenSentimentCtrl', function($scope, $uibModalInstance, curr) {

    $scope.sentiment_curr = curr.name

    $scope.close = function(){
        $uibModalInstance.close("close");
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss();
    }

});

var dvProfile = document.getElementById('dvProfile');
angular.element(document).ready(function() {
    angular.bootstrap(dvProfile, ['ProfileApp']);
});

