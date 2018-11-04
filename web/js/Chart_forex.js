
var Chart_forexApp = angular.module('forexApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})


Chart_forexApp.controller("Chart_forexController", function ($scope, $http) {

    $scope.all = []
    $scope.all1 = []
    $scope.alllikes = {}
    $scope.element={}

    var i = 0
    $scope.init = function (api,currency,likes) {
        //console.log("api", api, "currency", currency)
        var variable = currency.slice(0, 3)+ currency.slice(4,7)
        //console.log("varaible",variable)
        $.ajax({
            url: api,
            type: "GET",
            success: function (result) {

                $scope.all1 = result

                for (key in $scope.all1) {
                    if (i < 51) {
                        $scope.all1[key].fromSymbol = $scope.all1[key].fromSymbol.slice(0, 3) + "_" + $scope.all1[key].fromSymbol.slice(3, 6)

                        $scope.all.push($scope.all1[key])
                        i++
                    }
                    else break;


                }
                for(key in $scope.all) {
                    if ($scope.all[key].fromSymbol == currency) {
                        $scope.myforex = $scope.all[key]
                        console.log("$scope.myforex", $scope.myforex)
                    }

                }
            //console.log(" *******$scope.all",  $scope.all)
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

// var allimg={}

        // console.log("img", img)
        // $.ajax({
        //     url: img,
        //     type: "GET",
        //     success: function (result) {
        //         $scope.allimg1 = result
        //         //console.log("$scope.allimg1", $scope.allimg1)
        //         for (var i = 0; i < $scope.allimg1.length; i++) {
        //            if($scope.allimg1[i].name == variable) {
        //                $scope.allimg[$scope.allimg1[i].name.slice(0, 3) + "_" + $scope.allimg1[i].name.slice(3, 6)] = {img: $scope.allimg1[i].img}
        //            }
        //
        //         }
        //
        //         //console.log("$scope.allimg", $scope.allimg)
        //         $scope.$apply()
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         console.log("ERROR", thrownError, xhr, ajaxOptions)
        //     }
        // });
        //console.log("likes",likes)
        $.ajax({
            url: likes,
            type: "GET",
            success: function (result) {
                $scope.alllikes = result
                for (const key in $scope.alllikes) {
                    var name =$scope.alllikes[key].name.slice(0, 3) + "_" + $scope.alllikes[key].name.slice(3, 6)
                    $scope.element[name]= $scope.alllikes[key]
                    var sent=($scope.element[name].likes/($scope.element[name].likes+$scope.element[name].unlikes))*100
                    // console.log("Response*likes*", sent)
                    $scope.element[name].sentiment=Number(sent.toFixed(1))

                }

                for (const key in $scope.element) {

                    if (key== currency) {
                        $scope.allimg = $scope.element[key]
                        //console.log("Response*likes*Forex", $scope.allimg)

                }

                }

                $scope.$apply()


            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });



    }

//
//
    var socket = io.connect("https://forex-websocket.herokuapp.com/", {
        path: "/socket/forex/livefeed"
    })

    socket.emit("room", "all_pairs")
    socket.on("message", function (response) {
    //console.log("$scope.all", response)
        var item73
        if($scope.all.length != 0)
        {
             //console.log("$scope.all", $scope.all)

        for(key in response)
        {
            //console.log("response",response)
            item73 = $scope.all.find(function (element) {

                // return element.fromSymbol == (response[key].fromSymbol.slice(0, 3) + "/" + response[key].fromSymbol.slice(3, 6));
                return element.pair == (response[key].pair)
            });


            if (typeof item73 != typeof undefined) {
                // console.log("---",item73)
                for (const property in response[key]) {


                    if (response[key].hasOwnProperty(property) && property != "fromSymbol") {
                        item73[property] = response[key][property];
                        // console.log(item73[key])


                    }
                }
            }
        }
        }
        $scope.$apply()

    })


});

var dvChart_forex= document.getElementById('dvChart_forex');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart_forex, ['forexApp']);
});
