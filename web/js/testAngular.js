(function(window) {
    var demo_crypto = angular.module('LiveFeedsApp', []).config(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    });

    demo_crypto.controller("testAngularController", function ($scope, $http) {

        console.log("angular works");


   //
        $scope.all = []
        $scope.all1 = []
        $scope.allimg = {}
        $scope.allimg1 = []

        var i = 0
        $scope.init = function (api, img,chart_link) {
            console.log("api", api, "chart_link",chart_link)
            $.ajax({
                url: api,
                type: "GET",
                success: function (result) {

                    $scope.all1 = result

                    for (key in $scope.all1) {
                        if (i < 101) {
                            $scope.all1[key].fromSymbol = $scope.all1[key].fromSymbol.slice(0, 3) + "/" + $scope.all1[key].fromSymbol.slice(3, 6)

                            $scope.all.push($scope.all1[key])
                            i++
                        }
                        else break;
                    }
                    console.log("Response-forex", $scope.all)

                    $scope.$apply()
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("ERROR", thrownError, xhr, ajaxOptions)
                }
            });

// var allimg={}

            console.log("img", img)

        }


    });

    // var dvSecond = document.getElementById('dvSecond');
    //
    // angular.element(document).ready(function() {
    //
    //     angular.bootstrap(dvSecond, ['demo_crypto']);
    // });

})(window);