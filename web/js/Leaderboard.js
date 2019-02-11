var LeaderboardApp = angular.module('LeaderboardApp', ['ui.bootstrap', 'memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

LeaderboardApp.controller('LeaderboardController', function($scope,$window,$location,MemberService,$http,$timeout) {
    $scope.tab = 1;
    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };

    $scope.listCountry = [];
    $scope.listUsers = []

    $scope.country_name;
    $scope.country_value;

    $scope.result = []
    $scope.country =[]
    $scope.Users= []

    $scope.got_flw = false

    $scope.onSelect = function ($item, $model, $label) {
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        //console.log("$scope.$item",$scope.$item.name,$scope.$model,$scope.$label)

        if($scope.$model.type == 'country'){
            $scope.listUsers = []

            for (var k = 0; k < $scope.Users.length; k++) {
                //console.log(' $scope.Users[k].country',  $scope.Users[k].country)
                if($scope.Users[k].country == $scope.$model.name){

                    var obj = {
                        name: $scope.Users[k].nickname,
                        value: $scope.$model.value,
                        _id: $scope.Users[k]._id,
                        type: 'user'
                    }
                    $scope.listUsers.push(obj)
                }
            }
        }
        // if($scope.$item.name.indexOf(' ') > -1)
        //     $scope.$item.name = $scope.$item.name.replace(' ', '-')
        //
        // if($scope.$item.value.indexOf(' ') > -1)
        //     $scope.$item.value = $scope.$item.value.replace(' ', '-')
        //
        // var url =  Routing.generate('Live_rates_stocks',{"name" :$scope.$item.name, "value":$scope.$item.value})
        // //console.log("Routing",Routing.generate('Live_rates_stocks',{"name" :$scope.$item.name, "value":$scope.$item.value}))
        // window.location.href= url
    };

    $scope.init = function () {
        $scope.spinner = true

        //***************************************************
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $scope.userLoggedIn = true;
                user.getIdToken(true).then(function (idToken) {
                    //console.log("getIdToken")
                    $scope.idToken = idToken
                    $scope._id = {
                        _id: user.uid
                    }

                    MemberService.getUsersById($scope.idToken, $scope._id).then(function (results) {
                        //console.log("getUsersById",results.data)
                        $scope.user = results.data
                        $scope.got_user = true
                    })
                    .then(()=>{
                        MemberService.getFollowingOfUser($scope.idToken).then(function (results) {
                            $scope.get_following = results
                            console.log("get_following)",$scope.get_following)

                            $scope.got_following_flag = true
                        })
                        .then(()=>{
                            var check = function() {
                                if($scope.got_flw == false) {
                                    console.log("wait for following")
                                    $timeout(check, 100);
                                }
                                else{
                                    // console.log($scope.Users)
                                    $scope.Users.forEach(user => {
                                        $scope.get_following.forEach(follow => {
                                            // console.log(follow)
                                            if(user._id == follow._id){
                                                user.is_followed = true
                                                return;
                                            }
                                        });
                                    });
                                    $scope.for_follow_finished = true
                                }
                                $scope.$apply();
                            }
                            $timeout(check, 100)
                        })
                        .then(()=>{
                            var check = function() {
                                if( $scope.got_user == true &&
                                    $scope.got_following_flag == true &&
                                    $scope.got_flw == true &&
                                    $scope.for_follow_finished == true) {
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
                });
            }
            else{
                $scope.userLoggedIn = false;
                console.log("no user")
                $scope.$apply();
            }
        });

        // ***********************************************************************
        $http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-sentiments-leaderboard")
            .then(function(result) {
                $scope.leaderbord_users = result.data
                for (var k = 0; k < $scope.leaderbord_users.length; k++) {
                    if($scope.leaderbord_users[k].country.indexOf(' ')>-1){
                        $scope.leaderbord_users[k].country =$scope.leaderbord_users[k].country.replace(/ /g,'-')
                    }
                    $scope.leaderbord_users[k].country = $scope.leaderbord_users[k].country.toLocaleLowerCase()
                }
                console.log(  $scope.leaderbord_users)
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("error", $scope.data)
                // $scope.$apply();
            })

        //****************************************************************
        $http.get("https://xosignals.herokuapp.com/trading-compare-v2/get-users")
            .then(function(result) {
               //console.log('****result',result.data)
                $scope.Users = result.data
                $scope.str = ""

                for (var k = 0; k < $scope.Users.length; k++) {

                    $scope.Users[k].is_followed = false

                    if($scope.Users[k].country.indexOf('-')>-1){
                        $scope.Users[k].country = $scope.Users[k].country.replace('-',' ')
                    }

                    if($scope.Users[k].country.indexOf(' ')>-1){
                        //console.log('$scope.Users[k].country',$scope.Users[k].country)
                        $scope.splitCountry = $scope.Users[k].country.split(' ')
                        $scope.goodCountryName = ""
                        for(i=0;i<$scope.splitCountry.length;i++){
                            $scope.goodCountryName += $scope.splitCountry[i].charAt(0).toUpperCase() + $scope.splitCountry[i].slice(1) + " "
                        }
                        $scope.goodCountryName= $scope.goodCountryName.trim()
                        $scope.CountryVal = $scope.Users[k].country.toLocaleLowerCase().replace(/ /g,'-')
                        $scope.Users[k].country =  $scope.goodCountryName
                        $scope.Users[k].countryVal =  $scope.CountryVal
                        // console.log(' $scope.goodCountryName', $scope.goodCountryName)
                    }
                    else{
                        $scope.goodCountryName = ""
                        $scope.goodCountryName = $scope.Users[k].country.charAt(0).toUpperCase() + $scope.Users[k].country.slice(1) + " "
                        $scope.CountryVal = $scope.Users[k].country.toLocaleLowerCase()
                        $scope.Users[k].country =  $scope.goodCountryName
                        $scope.Users[k].countryVal =  $scope.CountryVal
                        // console.log(' $scope.goodCountryName', $scope.goodCountryName)
                    }

                    if($scope.str.indexOf($scope.goodCountryName) == -1){
                        // console.log('****',$scope.goodCountryName,)
                        $scope.str += $scope.goodCountryName + ","
                        // console.log('$scope.str',$scope.str)
                        var CountryObj = {
                            name:  $scope.goodCountryName,
                            value: $scope.CountryVal,
                            type: 'country'
                        }
                        $scope.listCountry.push(CountryObj)
                    }

                    if($scope.goodCountryName == 'United States'){
                        var obj = {
                            name: $scope.Users[k].nickname,
                            value: $scope.CountryVal,
                            _id: $scope.Users[k]._id,
                            type: 'user'
                        }
                        $scope.listUsers.push(obj)
                    }
                }
                //console.log(' $scope.Users', $scope.Users)
                $scope.userPerPage = 10;
                $scope.currentPage_user = 0;
                $scope.total_user =  $scope.Users.length;
                $scope.all_users =  $scope.offset_users($scope.currentPage_user * $scope.userPerPage, $scope.userPerPage);
            })
            .then(()=>{
                $scope.got_flw = true
            })
            .catch(function (error) {
                $scope.data = error;
                console.log("error", $scope.data)
                // $scope.$apply();
            })
    }



/********* USERS *********/
$scope.offset_users = function(offset, limit) {
    return  $scope.Users.slice(offset, offset+limit);
}

$scope.loadMore_users = function() {
    $scope.currentPage_user++;
    var newItems = $scope.offset_users($scope.currentPage_user*$scope.userPerPage,
        $scope.userPerPage);
    $scope.all_users = $scope.all_users.concat(newItems);
};

$scope.nextPageDisabledClass_users = function() {
    if ($scope.currentPage_user === $scope.pageCount_users()-1){
        $scope.disabled_users = {
            'background-color': '#9B9B9B',
            "color" : "white",
            'border':'none'
        }
    }
    return $scope.currentPage_user === $scope.pageCount_users()-1 ? "disabled" : "";
};

$scope.pageCount_users = function() {
    return Math.ceil($scope.total_user/$scope.userPerPage);
};


/******************** FOLLOW *******************/
$scope.add_follow = function(index) {
    //console.log('index',index, $scope.Users[index])
    if($scope.Users == undefined || $scope.user == undefined){
        return;
    }

    $scope.Users[index].is_followed = true

    $scope.follow = {
        id_following: $scope.user._id,
        id_followed: $scope.Users[index]._id,
        nickname_following: $scope.user.nickname,
        nickname_followed: $scope.Users[index].nickname,
        country_following: $scope.user.countryData.country,
        country_followed: $scope.Users[index].country,
        idToken: $scope.idToken
    }

    $scope.get_following.push({
        _id: $scope.Users[index]._id,
        nickname: $scope.Users[index].nickname,
        country: $scope.Users[index].country
    })

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

$scope.remove_follow = function(index) {
    //console.log('index',index,$scope.Users[index])

    if($scope.Users == undefined || $scope.user == undefined){
        return;
    }

    $scope.Users[index].is_followed = false

    $scope.follow = {
        id_following: $scope.user._id,
        id_followed: $scope.Users[index]._id,
        idToken: $scope.idToken
    }

    for(i=0;i<$scope.get_following.length;i++){
        if($scope.get_following[i]._id == $scope.Users[index]._id){
            $scope.get_following.splice(i, 1)
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


var dvLeaderboard = document.getElementById('dvLeaderboard');
angular.element(document).ready(function() {
    angular.bootstrap(dvLeaderboard, ['LeaderboardApp']);
});

