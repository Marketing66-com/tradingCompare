var MyProfileApp = angular.module('MyProfileApp', ['ui.bootstrap', 'memberService','watchlistService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

MyProfileApp.controller('MyProfileController', function($scope,$window,$location,$http,MemberService,WatchlistService, $interval,$timeout,$uibModal) {

        $scope.tab = 1;

        $scope.setTab = function (newTab) {
            $scope.tab = newTab;
        };

        $scope.isSet = function (tabNum) {
            return $scope.tab === tabNum;
        };

    $scope.the_bio_description = '';
    $scope.sentarray=[];$scope.sentarray1=[];$scope.sentarray2=[];

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
                    $scope.id = user.uid
                    $scope._id = {
                        _id: user.uid
                    }

                    // MemberService.createOtherUser($scope.Other_id).then(function (results) {
                    //     console.log("$scope.other_User", results.data)
                    //     $scope.other_User = results.data
                    // })
                    // MemberService.getOtherFollowing($scope.Other_id._id).then(function (results) {
                    //     // console.log("Other_following", results)
                    //     $scope.other_following = results
                    // })
                    // MemberService.getOtherFollowers($scope.Other_id._id).then(function (results) {
                    //     // console.log("Other_followers", results)
                    //     $scope.other_followers = results
                    // })
                    // MemberService.getOtherComments($scope.Other_id._id).then(function (results) {
                    //     // console.log("Other_Comments", results)
                    //     $scope.other_Comments = results
                    // })
                    // MemberService.getOtherSentiments($scope.Other_id._id).then(function (results) {
                    //     // console.log("Other_Sentiments", results)
                    //     $scope.other_Sentiments = results
                    // })


                    MemberService.getUsersById($scope.idToken, $scope._id).then(function (results) {
                        $scope.user = results.data
                        if($scope.user.description == ""){
                            $scope.the_bio_description = '- No description yet - Click here to fill your description'
                        }
                        else{
                            $scope.the_bio_description = $scope.user.description
                        }
/***********************/
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
                            console.log($scope.get_following)

                        })
                            .catch(function (error) {
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
                        })
                            .catch(function (error) {
                                console.log('ERROR: ', error)
                                $scope.$apply();
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
                                console.log('ERROR: ', error)
                                $scope.$apply();
                            })

                        /*****************************/
                        console.log("$scope.user",  $scope.user)
                        $scope.$apply();
                    })
                        .catch(function (error) {
                            $scope.data = error;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })



                })
                    .catch(function (error) {
                        console.log('ERROR: ', error)
                        $scope.$apply();
                    })
            }
            else {
                $scope.userLoggedIn = false;
                console.log("no user")
                $scope.$apply();
            }
        })


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

            $scope.$apply();
            resolve($scope.get_MyComments)
        })
    }


///////////////////////////////////end tab1////////////////////////////////////////////////////


///////////////////////////////////tab2 Watchlist////////////////////////////////////////////////////

    BuildWatchlist = function() {
        return new Promise(function (resolve, reject) {

            if ($scope.user.watchlist.length > 0) {
                //console.log("in if watchlist.lenght>0")
                $scope.user.watchlist.forEach(currencie => {
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
                for (i = 0; i < $scope.user.watchlist.length; i++) {
                    for (j = 0; j < $scope.WatchlistTemp.length; j++) {
                        if ($scope.user.watchlist[i].symbol == $scope.WatchlistTemp[j].pair) {
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
        //         $scope.WatchlistTable[index].isInMyWL = false
                $scope.WatchlistTable.splice(index, 1)


        $scope.data_to_send ={
            data: { symbol:$scope.WatchlistTable[index].pair,
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

    // $scope.add_to_watchlist = function(index) {
    //     if($scope.user == undefined || $scope.user.length == 0 ){
    //         console.log("return")
    //         return;
    //     }
    //
    //     if($scope.user.phone_number == ""){
    //         $('.modal_sigh-up').slideDown();
    //         return;
    //     }
    //
    //     if(!$scope.user.verifyData.is_phone_number_verified){
    //         $('.modal_sigh-up').slideDown();
    //         return;
    //     }
    //
    //     $scope.WatchlistTable[index].isInMyWL =  true
    //
    //     $scope.data_to_send ={
    //         data: { symbol:$scope.WatchlistTable[index].pair,
    //             type:$scope.WatchlistTable[index].symbol
    //         },
    //         _id: $scope.user._id
    //     }
    //     MemberService.Add_to_watchlist($scope.idToken, $scope.data_to_send).then(function (results) {
    //         console.log("results",results)
    //     })
    //         .catch(function (error) {
    //             $scope.data = error;
    //             console.log("$scope.data", $scope.data)
    //             $scope.$apply();
    //         })
    // }

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

            for(i=0;i<$scope.get_following.length; i++){
                $scope.get_following[i].myFollow= true
                $scope.get_following[i].mycountry=$scope.get_following[i].country.toLowerCase().replace(/\s+$/, '').replace(' ','-')
            }
            $scope.$apply()
            // console.log("*******",$scope.get_following)

            resolve($scope.get_following)
        })
    }
    //
    // $scope.add_follow = function(index) {
    //     //console.log('index',index, $scope.Users[index])
    //     if($scope.get_following == undefined || $scope.user == undefined){
    //         return;
    //     }
    //
    //     $scope.get_following[index].myFollow = true
    //
    //     $scope.follow = {
    //         id_following: $scope.user._id,
    //         id_followed: $scope.other_following[index]._id,
    //         nickname_following: $scope.user.nickname,
    //         nickname_followed: $scope.other_following[index].nickname,
    //         country_following: $scope.user.countryData.country,
    //         country_followed: $scope.other_following[index].country,
    //         idToken: $scope.idToken
    //     }
    //
    //     $scope.get_following.push({
    //         _id: $scope.other_following[index]._id,
    //         nickname: $scope.other_following[index].nickname,
    //         country: $scope.other_following[index].country,
    //
    //     })
    //
    //     for(i=0;i<$scope.other_followers.length;i++){
    //         if($scope.other_followers[i]._id == $scope.other_following[index]._id){
    //             // $scope.get_following.splice(i, 1)
    //             $scope.other_followers[i].myFollow = true
    //
    //         }
    //     }
    //     //console.log('FOLLOW',$scope.follow,$scope.get_following)
    //
    //     MemberService.Add_follow( $scope.idToken, $scope.follow).then(function (results) {
    //         console.log("add-follow",results)
    //     })
    //         .catch(function (error) {
    //             $scope.data = error;
    //             console.log("$scope.data", $scope.data)
    //             $scope.$apply();
    //         })
    // };

    $scope.remove_follow = function(index) {
        //console.log('index',index,$scope.Users[index])

        if($scope.get_following== undefined || $scope.user == undefined){
            return;
        }

        $scope.get_following[index].myFollow = false

        $scope.follow = {
            id_following: $scope.user._id,
            id_followed: $scope.get_following[index]._id,
            idToken: $scope.idToken
        }

        for(i=0;i<$scope.get_followers.length;i++){
            if($scope.get_followers[i]._id == $scope.get_following[index]._id) {
                $scope.get_followers[i].myFollow = false
            }
        }
        // for(j=0;j<$scope.get_following.length;j++){
        //     if($scope.get_following[j]._id == $scope.other_following[index]._id) {
                $scope.get_following.splice(index, 1)
        //     }
        // }


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
             for(i=0;i<$scope.get_followers.length; i++){
                 $scope.get_followers[i].myFollow= false
                 $scope.get_followers[i].mycountry=$scope.get_followers[i].country.toLowerCase().replace(/\s+$/, '').replace(' ','-')
                        for(j=0;j<$scope.get_following.length; j++){
                            if($scope.get_followers[i]._id==$scope.get_following[j]._id){
                                $scope.get_followers[i].myFollow= true
                            }
                        }
                    }
                    // console.log("*******",$scope.other_followers)

                    resolve($scope.get_followers)
            $scope.$apply()


        })
    }



    $scope.add_follow_from_followers = function(index) {
        //console.log('index',index, $scope.Users[index])
        if($scope.get_followers == undefined || $scope.user == undefined){
            return;
        }

        $scope.get_followers[index].myFollow = true

        $scope.follow = {
            id_following: $scope.user._id,
            id_followed: $scope.get_followers[index]._id,
            nickname_following: $scope.user.nickname,
            nickname_followed: $scope.get_followers[index].nickname,
            country_following: $scope.user.countryData.country,
            country_followed: $scope.get_followers[index].country,
            idToken: $scope.idToken
        }

        $scope.get_following.push({
            _id: $scope.get_followers[index]._id,
            nickname: $scope.get_followers[index].nickname,
            country: $scope.get_followers[index].country,
            mycountry:$scope.get_followers[index].country.toLowerCase().replace(/\s+$/, '').replace(' ','-'),
            myfollow:$scope.get_followers[index].myFollow
        })

        for(i=0;i<$scope.get_following.length;i++){
            if($scope.get_following[i]._id == $scope.get_followers[index]._id){
                // $scope.get_following.splice(i, 1)
                $scope.get_following[i].myFollow = true

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

        if($scope.get_followers == undefined || $scope.user == undefined){
            return;
        }

        $scope.get_followers[index].myFollow = false

        $scope.follow = {
            id_following: $scope.user._id,
            id_followed: $scope.get_followers[index]._id,
            idToken: $scope.idToken
        }

        for(i=0;i<$scope.get_following.length;i++){
            if($scope.get_following[i]._id == $scope.get_followers[index]._id){
                $scope.get_following[i].myFollow = false
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
                    $scope.sentiment = $scope.user_sentiments;
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
                    for (var k = 0; k < $scope.user_sentiments.length; k++) {
                        if ($scope.listTemp[j].pair == $scope.user_sentiments[k].symbol) {
                            $scope.sent[$scope.listTemp[j].pair].name = $scope.listTemp[j].name;
                            $scope.sent[$scope.listTemp[j].pair].change24 = $scope.listTemp[j].change24;
                            $scope.sent[$scope.listTemp[j].pair].img = $scope.listTemp[j].img;
                        }
                    }
                }

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

MyProfileApp.directive('clickToEdit', function($timeout,MemberService) {
    return {
        require: 'ngModel',
        scope: {
            model: '=ngModel',
            idToken: '=tIdtoken',
            id: '=tUserid',
            type: '@type'
        },
        replace: true,
        transclude: false,
        template:
        '<div class="templateRoot">'+
        '<div class="hover-edit-trigger" title="click to edit">'+
        '<div class="hover-text-field" ng-show="!editState" ng-click="toggle()">{[{model}]}<div class="edit-pencil glyphicon glyphicon-pencil"></div></div>'+
        '<input style="width: 100%;" class="inputText" type="text" ng-model="localModel" ng-enter="save()" ng-show="editState && type == \'inputText\'" />' +
        '</div>'+
        '<div class="edit-button-group pull-right" ng-show="editState">'+
        '<div class="glyphicon glyphicon-ok"  ng-click="save()"></div>'+
        '<div class="glyphicon glyphicon-remove" ng-click="cancel()"></div>'+
        '</div>'+
        '</div>',
        link: function (scope, element, attrs) {
            scope.editState = false;
            scope.localModel = scope.model;

            scope.$watch('model', function(newval, oldval){
                scope.localModel = scope.model;
            })

            scope.save = function(){

                if(scope.localModel == undefined ||
                    typeof scope.localModel == "undefined" ||
                    scope.localModel== "" ||
                    scope.localModel== "- No description yet - Click here to fill your description"){
                    // console.log('in else')
                    scope.localModel = scope.model;
                    scope.toggle();
                }
                else{
                    // console.log('in if')
                    scope.model = scope.localModel;
                    scope.update_data = {
                        "description":  scope.model,
                        "_id":  scope.id
                    }

                    MemberService.updateUser(scope.idToken, scope.update_data).then(function (results) {
                        console.log("update",results)
                    }).catch(function (error) {
                        scope.data = error;
                        console.log("scope.data", scope.data)
                    })

                    scope.toggle();
                }
            };

            scope.cancel = function(){
                scope.localModel = scope.model;
                scope.toggle();
            }

            scope.toggle = function () {
                scope.editState = !scope.editState;

                var x1 = element[0].querySelector("."+scope.type);
                $timeout(function(){
                    scope.editState ? x1.focus() : x1.blur();
                }, 0);
            }
        }
    }
});

MyProfileApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

MyProfileApp.controller('OpenSentimentCtrl', function($scope, $uibModalInstance, curr) {

    $scope.sentiment_curr = curr.name

    $scope.close = function(){
        $uibModalInstance.close("close");
    }

    $scope.cancel = function(){
        $uibModalInstance.dismiss();
    }

});

var dvMyProfile = document.getElementById('dvMyProfile');
angular.element(document).ready(function() {
    angular.bootstrap(dvMyProfile, ['MyProfileApp']);
});

