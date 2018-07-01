


var demo = angular.module('LiveFeedsApp',[]).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

demo.controller("CryptoFeedsController", function($scope,$http) {

    $scope.all = []
    $scope.allimg1 = []
    $scope.allimg = []

    $scope.init = function (api,img,chart_link) {

        console.log("api", api)
        $.ajax({
            url: api,
            type: "GET",
            success: function (result) {

                $scope.all = Object.keys(result).map(i => result[i])
                console.log("Response-crypto", $scope.all)
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });

        console.log("img", img)
        $.ajax({
            url: img,
            type: "GET",
            success: function (result) {
                $scope.allimg1 = result
                $scope.allimg=$scope.allimg1[0]
                console.log("Response*crypto*", $scope.allimg)
                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR", thrownError, xhr, ajaxOptions)
            }
        });


    }




    var socket = io.connect("https://crypto-ws.herokuapp.com")

    socket.on('connect', function () {
        socket.emit('room', "all_regulated");
        socket.on('message', data => {
            for (const key in data) {
                var item73 = $scope.all.find(function (element) {

                    return ((element.fromSymbol == key.split("_",1))&&(element.toSymbol == key.split("_")[1]));

                })
                // console.log("item73", item73)
                if (typeof item73 != typeof undefined) {
                    for (const ky in data[key]) {
                        if (data.hasOwnProperty(key)) {
                            item73[ky] = data[key][ky];

                        }
                    }

                }
                $scope.$apply()
            }
            //
        })
    })

    $scope.getDisplayValue = function(currentValue)
    {
        return intFormat(currentValue);
    }

    // $scope.ActiveChange=function(symbol){
    //     var from = symbol.split("/",1)
    //     var to = symbol.split("/",2)
    //
    //     console.log(symbol,from[0],to[1],'*********************')
    //      // console.log("----",Routing.generate('crypto_chart',from,to, true))
    //
    // }



    $scope.ActiveChange = function (symbol) {

        // var from = symbol.split("/",1)
        // var to = symbol.split("/",2)
        var sym= symbol.split("/")
        console.log(from[0], to[1], '*********************')
        var url =  Routing.generate('crypto_chart',{"currency" :sym})
        console.log(Routing.generate('crypto_chart',{"currency" :sym}))
        window.location.href= url
        //  console.log("----", Routing.generate('crypto_chart', from, to, true))
        return url
        // console.log("----",Routing.generate('crypto_chart'))

    }

})




//     var socket = io.connect("https://xosignals.herokuapp.com/", {
//         path: "/socket/xosignals/livefeed"
//     })
//     socket.on("onUpdate", function (response) {
// //console.log(response)
//         var item73 = $scope.all.find(function(element) {
//             return element.name == response.symbol;
//         });
//
//         console.log(item73)
// if(typeof item73 != typeof undefined)
// {
//     for (const key in response.data) {
//         if (response.data.hasOwnProperty(key)) {
//             item73[key] = response.data[key];
//            $scope.$apply()
//         }
//     }
// }


// $scope.init = function(url){
//     console.log(Routing.generate(url))
//     var my_url = Routing.generate(url)



// path('crypto_chart',{'from':'{[{curr.fromSymbol}]}','to':'{[{curr.toSymbol}]}'})