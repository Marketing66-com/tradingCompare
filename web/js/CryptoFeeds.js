var secondApp = angular.module('secondApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})

secondApp.controller('SecondController', function($scope) {
    $scope.desc2 = "Second app. ";

    $scope.all = []
    $scope.allimg1 = []
    $scope.allimg = []
    $scope.alllikes = {}
    $scope.element={}

/////////////////////////////////////////////////////////////////////////
    $scope.init = function (api, chart_link,likes) {
        console.log("api", api, "chart_link",chart_link)
        $.ajax({
            url: api,
            type: "GET",
            success: function (result) {
                $scope.result = result.slice(0,50)
                //console.log("$scope.result",$scope.result)
                $scope.all = Object.keys( $scope.result).map(i =>  $scope.result[i])
                //console.log("Response-crypto", $scope.all)
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });
        //     //console.log("img", img)
        //     $.ajax({
        //         url: img,
        //         type: "GET",
        //         success: function (result) {
        //             $scope.allimg1 = result
        //             $scope.allimg=$scope.allimg1[0]
        //             console.log("IMAGE", $scope.allimg)
        //             $scope.$apply()
        //         },
        //         error: function (xhr, ajaxOptions, thrownError) {
        //             console.log("ERROR", thrownError, xhr, ajaxOptions)
        //         }
        //     });
        // }

////////////////////////////////////////////////////////////////////
        $.ajax({
            url: likes,
            type: "GET",
            success: function (result) {
                $scope.alllikes = result
                for (const key in $scope.alllikes) {
                    $scope.element[$scope.alllikes[key].symbol]= $scope.alllikes[key]
                    var sent=($scope.element[$scope.alllikes[key].symbol].likes/($scope.element[$scope.alllikes[key].symbol].likes+$scope.element[$scope.alllikes[key].symbol].unlikes))*100
                    // console.log("Response*likes*", sent)
                    $scope.element[$scope.alllikes[key].symbol].sentiment=Number(sent.toFixed(1))
                }
                $scope.allimg=$scope.element
                console.log("Response*likes*", $scope.allimg)
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });
    }

    var itemsDetails = []
    $scope.numOfPages = function () {
        return Math.ceil(itemsDetails.length / $scope.itemsPerPage);
    };
    $scope.$watch('curPage + numPerPage', function() {
        var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
            end = begin + $scope.itemsPerPage;

        $scope.filteredItems = itemsDetails.slice(begin, end);
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////

    // var socket = io.connect("https://crypto-ws.herokuapp.com")
    var socket = io.connect('http://www.evisbregu.com:8002');

    socket.on('connect', function () {
        socket.emit('room', "all_regulated_by_average");
        socket.on('message', data => {
            //console.log("data all regulated", data)
            for (const key in data) {
                var item73 = $scope.all.find(function (element) {
                    return ((element.fromSymbol == key.split("_",1))&&(element.toSymbol == key.split("_")[1]));
                })
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
    // socket.on('connect', function () {
    //     socket.emit('room', "all_regulated");
    //     socket.on('message', data => {
    //         //console.log("data all regulated", data)
    //         for (const key in data) {
    //         var item73 = $scope.all.find(function (element) {
    //
    //             return ((element.fromSymbol == key.split("_",1))&&(element.toSymbol == key.split("_")[1]));
    //
    //         })
    //         // console.log("item73", item73)
    //         if (typeof item73 != typeof undefined) {
    //             for (const ky in data[key]) {
    //                 if (data.hasOwnProperty(key)) {
    //                     item73[ky] = data[key][ky];
    //                 }
    //             }
    //         }
    //         $scope.$apply()
    //     }
    // })
    // })

    $scope.getDisplayValue = function(currentValue)
    {
        return intFormat(currentValue);
    }


    $scope.ActiveChange = function (symbol) {

        var sym= symbol.split("/")
        var url =  Routing.generate('crypto_chart',{"currency" :sym})
        window.location.href= url
        return url

    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////

});

var dvSecond = document.getElementById('dvSecond');
angular.element(document).ready(function() {
    angular.bootstrap(dvSecond, ['secondApp']);
});
