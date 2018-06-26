var demo = angular.module('LiveBarApp',[]).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

demo.controller("BarFeedsController", function($scope,$http) {

    $scope.all =[]
    $scope.crypto1 =[]
    $scope.crypto2 =[]
    $scope.init = function(api, first, second, third, fourth, fifth, sixth){
        console.log("api", api, first, second, third, fourth, fifth, sixth)
        $.ajax({
            url: api,
            type: "GET",
            success: function (result) {
                $scope.all = result
                console.log("Response",  $scope.all)
                for(i=0;i<result.length;i++)
                {
                    if(result[i].fromSymbol == first) {$scope.crypto1 = result[i]}
                    if(result[i].fromSymbol == second) { $scope.crypto2 = result[i]}
                    if(result[i].fromSymbol == third) { $scope.crypto3 = result[i]}
                    if(result[i].fromSymbol == fourth) { $scope.crypto4 = result[i]}
                    if(result[i].fromSymbol == fifth ) { $scope.crypto5 = result[i]}
                    if(result[i].fromSymbol == sixth) {  $scope.crypto6 = result[i]}

                }

                console.log("crypto",  $scope.crypto5)


                $scope.$apply()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR",thrownError,xhr,ajaxOptions)
            }
        });
    }

    var socket = io.connect("https://crypto-ws.herokuapp.com")

    socket.on('connect', function () {
        socket.emit('room', "all_regulated");
        socket.on('message', data => {

            for (const key in data) {
            var item73 = $scope.all.find(function (element) {

                return (element.fromSymbol == key.split("_",1) && element.toSymbol == key.split("_")[1]);

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
})