
var Chart_forexApp = angular.module('forexApp', []).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');})


Chart_forexApp.controller("Chart_forexController", function ($scope, $http) {

    $scope.sentiment;
    $scope.name;
    $scope.img;

    $scope.from;
    $scope.to;

    $scope.current_room = $scope.from + $scope.to

    ///////////////////////////////////////// SOCKET ///////////////////////////////////////////
    $scope.socket = io.connect('https://forex.tradingcompare.com');
    $scope.socket.on('connect', () => {
        $scope.socket.emit('room',  $scope.current_room );
    })
    $scope.socket.on('message', data => {
       // console.log("data******", data.variation, data.price);
        $scope.myforex = data

        if (data.variation == "down") {
                jQuery("cq-current-price").text(data.price).removeClass('positive')
                    .addClass('negative')
        }
        else if (data.variation == "up") {
                jQuery("cq-current-price").text(data.price).removeClass('negative')
                    .addClass('positive')
        }
        else if (data.variation == "none"){
            jQuery("cq-current-price").text(data.price).removeClass('negative').removeClass('positive')
        }
        if (data.change24 > 0) {
            jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
                .format(data.change24) + "%").removeClass('negative')
                .addClass('positive').css({'font-size': 15});
        } else {
            jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
                .format(data.change24) + "%").removeClass('positive')
                .addClass('negative').css({'font-size': 15});
        }

        $scope.myforex.name = $scope.name
        $scope.myforex.img = $scope.img
        $scope.myforex.sentiment = $scope.sentiment

        $scope.$apply()
    })
    ///////////////////////////////////////// SOCKET ///////////////////////////////////////////

    $scope.init = function (from,to) {
        $scope.from = from
        $scope.to = to
        $scope.mypair = from + to
        console.log("api",from,to)

        $.ajax({
            url: "https://forex.tradingcompare.com/all_data/" + $scope.mypair,
            type: "GET",
            success: function (result) {

                $scope.myforex = result
                //console.log("$scope.myforex",  $scope.myforex )

                // IMAGE
                if ($scope.myforex.img == "https://www.interactivecrypto.com/wp-content/uploads/2018/06/piece.png" ||
                    $scope.myforex.img == undefined ||
                    typeof $scope.myforex.img == "undefined")
                    $scope.myforex.img = "/img/Stock_Logos/stocks.png"

                //SENTIMENT
                var sent = ($scope.myforex.likes / ($scope.myforex.likes + $scope.myforex.unlikes)) * 100
                $scope.myforex.sentiment = Number(sent.toFixed(1))
                $scope.sentiment = Number(sent.toFixed(1))

                $scope.name = $scope.myforex.name
                $scope.img = $scope.myforex.img

                fill_Chart_Change_Price($scope.myforex)

                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        function fill_Chart_Change_Price(object) {
            if (object.change24 > 0) {
                jQuery("cq-todays-change").text('\u25b2' + Intl.NumberFormat("en-US")
                    .format(object.change24) + "%")
                    .addClass('positive').css({'font-size': 15});
            } else {
                jQuery("cq-todays-change").text('\u25bc' + Intl.NumberFormat("en-US")
                    .format(object.change24) + "%")
                    .addClass('negative').css({'font-size': 15});
            }
            jQuery("cq-current-price").text(object.price);
        }

        // $.ajax({
        //     url: api,
        //     type: "GET",
        //     success: function (result) {
        //         $scope.all1 = result
        //         for (key in $scope.all1) {
        //             if (i < 51) {
        //                 $scope.all1[key].fromSymbol = $scope.all1[key].fromSymbol.slice(0, 3) + "_" + $scope.all1[key].fromSymbol.slice(3, 6)
        //                 $scope.all.push($scope.all1[key])
        //                 i++
        //             }
        //             else break;
        //         }
        //         for(key in $scope.all) {
        //             if ($scope.all[key].fromSymbol == currency) {
        //                 $scope.myforex = $scope.all[key]
        //                 console.log("$scope.myforex", $scope.myforex)
        //             }
        //         }
        //         $scope.$apply()
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         console.log("ERROR", thrownError, xhr, ajaxOptions)
        //     }
        // });
        //
        // $.ajax({
        //     url: likes,
        //     type: "GET",
        //     success: function (result) {
        //         $scope.alllikes = result
        //         for (const key in $scope.alllikes) {
        //             var name =$scope.alllikes[key].name.slice(0, 3) + "_" + $scope.alllikes[key].name.slice(3, 6)
        //             $scope.element[name]= $scope.alllikes[key]
        //             var sent=($scope.element[name].likes/($scope.element[name].likes+$scope.element[name].unlikes))*100
        //             // console.log("Response*likes*", sent)
        //             $scope.element[name].sentiment=Number(sent.toFixed(1))
        //         }
        //         for (const key in $scope.element) {
        //             if (key== currency) {
        //                 $scope.allimg = $scope.element[key]
        //                 //console.log("Response*likes*Forex", $scope.allimg)
        //             }
        //         }
        //         $scope.$apply()
        //     },
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         console.log("ERROR", thrownError, xhr, ajaxOptions)
        //     }
        // })
    }




    // var socket = io.connect("https://forex-websocket.herokuapp.com/", {
    //     path: "/socket/forex/livefeed"
    // })
    //
    // socket.emit("room", "all_pairs")
    // socket.on("message", function (response) {
    // //console.log("$scope.all", response)
    //     var item73
    //     if($scope.all.length != 0)
    //     {
    //          //console.log("$scope.all", $scope.all)
    //
    //     for(key in response)
    //     {
    //         //console.log("response",response)
    //         item73 = $scope.all.find(function (element) {
    //
    //             // return element.fromSymbol == (response[key].fromSymbol.slice(0, 3) + "/" + response[key].fromSymbol.slice(3, 6));
    //             return element.pair == (response[key].pair)
    //         });
    //
    //
    //         if (typeof item73 != typeof undefined) {
    //             // console.log("---",item73)
    //             for (const property in response[key]) {
    //
    //
    //                 if (response[key].hasOwnProperty(property) && property != "fromSymbol") {
    //                     item73[property] = response[key][property];
    //                     // console.log(item73[key])
    //
    //
    //                 }
    //             }
    //         }
    //     }
    //     }
    //     $scope.$apply()
    //
    // })


});

var dvChart_forex= document.getElementById('dvChart_forex');

angular.element(document).ready(function() {

    angular.bootstrap(dvChart_forex, ['forexApp']);
});
