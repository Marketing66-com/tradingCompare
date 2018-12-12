var searchapp =angular.module('searchapp', [ 'ngSanitize', 'ui.bootstrap']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

searchapp.controller('TypeaheadCtrl', function($scope, filterFilter, $http) {

    var users=[]
    $scope.selectedUser = '';

    $http.get("https://websocket-stock.herokuapp.com/searchBar")
        .then(function(data) {
           //console.log("data",data.data)
            data = data.data
            for (key in data) {
                if (data[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png" ||
                    data[key].img == undefined ||
                    typeof data[key].img == "undefined")
                {
                    if(data[key].group == "CRYPTO"){
                        data[key].img = "/img/crypto_logos/crypto-other.png"
                    }
                    else{
                        data[key].img = "/img/Stock_Logos/stocks.png"
                    }
                }
                users.push(data[key])
            }
        });

    // $.getJSON(window.location.origin + '/js/currency.json', function(data) {
    //     for (key in data) {
    //         if (data[key].img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png" ||
    //             data[key].img == undefined ||
    //             typeof data[key].img == "undefined")
    //          {
    //              if(data[key].group == "CRYPTO"){
    //                  data[key].img = "/img/crypto_logos/crypto-other.png"
    //              }
    //              else{
    //                  data[key].img = "/img/Stock_Logos/stocks.png"
    //              }
    //
    //          }
    //         users.push(data[key])
    //     }
    //
    // });

    $scope.getUsers = function (search) {

        $scope.result = []

        var filtered = $scope.startsWith(search);

        var results = _(filtered)
            .groupBy('group')
            .map(function (g) {
                if (g[0]){
                    g[0].firstInGroup = true;
                    g[0].InGroup = true;}// the first item in each group                      // the first item in each group
                if (g[1]){
                    g[1].InGroup = true;
                    g[1].firstInGroup = false;}
                if (g[2]){
                    g[2].InGroup = true;
                    g[2].firstInGroup = false;}
                if (g[3]){
                    g[3].InGroup = true;
                    g[3].firstInGroup = false;} // the first item in each group
                if (g[4]){
                    g[4].InGroup = true;
                    g[4].firstInGroup = false;}
                return g;
            })
            .flatten()
            .value();

        for (var k = 0; k < results.length; k++) {
            if (results[k].InGroup == true) {
                $scope.result.push(results[k])
            }
        }

        return $scope.result;
    }

    $scope.startsWith = function (viewValue) {
        //console.log(users)
        $scope.filter=[]
        for (var k = 0; k < users.length; k++) {
            if (typeof  users[k].name != "undefined") {
                if (typeof users[k].symbol != "undefined") {
                    if ((users[k].name.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase()) || users[k].symbol.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase()) {
                        users[k].Name =  users[k].name + " - " + users[k].symbol
                        // users[k].InGroup=false
                        $scope.filter.push(users[k])
                    }
                }
            }
            else {
                if (typeof  users[k].symbol != "undefined") {
                    if (users[k].symbol.substr(0, viewValue.length).toLowerCase() == viewValue.toLowerCase()) {
                        users[k].Name = users[k].symbol
                        // users[k].InGroup=false
                        $scope.filter.push(users[k])
                    }
                }
            }
            users[k].InGroup=false
        }
    
        return $scope.filter
    }



    var new_array = ['-', ' ', '/', '----', '---', '--']

    $scope.onSelect = function ($item, $model, $label) {
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        console.log("$scope.$item", $scope.$item, $scope.$model, $scope.$label)

        if ($scope.$item.group == "STOCKS") {
            // $scope.$item.symbol = $scope.$item.symbol.replace(/\s/g, '');

            var n = $scope.$item.symbol.indexOf('.');
            $scope.$item.symbol.substring(0, n != -1 ? n : $scope.$item.symbol.length)

            for(var i=0; i< new_array.length;i++) {
                if ($scope.$item.name.indexOf(new_array[i]) > -1) {
                    if (new_array[i] == '-')
                        $scope.$item.name = $scope.$item.name.replace(new RegExp(new_array[i], 'g'), ' ')
                    else
                        $scope.$item.name = $scope.$item.name.replace(new RegExp(new_array[i], 'g'), '-')
                }
                if ($scope.$item.name.indexOf("'") > -1) {
                    $scope.$item.name = $scope.$item.name.replace(/'/g, '')
                }
            }


            var url = Routing.generate('stock_chart', {"symbol": $scope.$item.symbol, "name": $scope.$item.name})
            console.log(Routing.generate('stock_chart', {"symbol": $scope.$item.symbol, "name": $scope.$item.name}))
            window.location.href = url
            return url
        }

        else if ($scope.$item.group == "CRYPTO") {
            $scope.$item.symbol = $scope.$item.symbol.replace(/\s/g, '');

            var sym = $scope.$item.symbol.replace("/", "_")
            var url = Routing.generate('crypto_chart', {"name": $scope.$item.name, "currency": sym})
            window.location.href = url
            return url
        }

        else if ($scope.$item.group == "FOREX") {
            $scope.$item.symbol = $scope.$item.symbol.replace(/\s/g, '');

            var sym = $scope.$item.symbol.replace("/", "-")

            var url = Routing.generate('forex_chart', {"currency": sym})
            console.log(Routing.generate('forex_chart', {"currency": sym}))
            window.location.href = url
            return url
        }


    };


});