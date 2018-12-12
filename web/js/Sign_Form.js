const signForm = angular.module('signForm', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

signForm.controller('AppForm', function ($scope, $http, $location, MemberService) {
    $scope.sign_up_countries = []
    // $scope.user = {}

    $scope.isDisabled = true;

    $scope.user  = new CreateUser();
    console.log("$scope.user",$scope.user)

    $scope.init = function () {
        $scope.numLimit = 10

        MemberService.getLocation().then(function (country) {
            $scope.location = country;
            $scope.user.country = country;

            $http.get('/js/countries.json').
            success(function(data, status, headers, config) {

                for(i=0;i<data.countries.length;i++){

                    if(data.countries[i].name ==  $scope.user.country){
                        $scope.user.countryData.dial_code = "( " + data.countries[i].dial_code + ")"
                        $scope.location_code =  "( " + data.countries[i].dial_code + ")"
                    }
                    $scope.sign_up_countries[i] = {
                        name: data.countries[i].name,
                        img: data.countries[i].name.replace(/ /g, "-").toLocaleLowerCase(),
                        dial_code: "( " + data.countries[i].dial_code+ ")",
                        code: data.countries[i].code,
                    }
                }
                // $scope.$apply()
            });
            console.log("$scope.user",$scope.user)
            $scope.$apply();
        }).catch(function (error) {
            $scope.data = error;
            $scope.$apply();
        })
    }

    $('#myul').scroll(function() {
        var x = $('#myul').scrollTop() + 195
        if(x > $scope.numLimit * 30) {
            $scope.numLimit = $scope.numLimit + 10
            $scope.$apply();
        }
    });


    $scope.loading = false ;
    $scope.already_exist = false;

    $scope.save = function(user) {
        console.log("submit",user)

        if(!$scope.form.$valid) {
            return;
        }
        $scope.loading = true ;

        MemberService.is_nickname_exist(user.nickname).then(function (results) {
            console.log("in fct",results)
            if(results){
                $scope.already_exist = true;
                $scope.loading = false ;

                console.log("in fct",results, $scope.already_exist,$scope.loading)
                return;
            }
            else{
                $scope.already_exist = false;
                $scope.loading = false ;
                console.log("$scope.user",$scope.user,$scope.loading)
            }
            $scope.$apply();
        }).catch(function (error) {
            $scope.data = error;
            $scope.$apply();
        })
    }

    $scope.master = {};
    $scope.reset = function(form) {
        console.log("reset form")
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }

        // $scope.user  = angular.copy($scope.master);
        $scope.user.country = $scope.location
        $scope.user.countryData.dial_code = $scope.location_code
        $scope.user.full_name = ""
        $scope.user.nickname = ""
        $scope.user.password = ""
        $scope.user.email = ""
        $scope.user.phone_number = ""
    };
    $scope.reset();

    $scope.setValue = function(x) {
        $scope.user.countryData.dial_code = x.dial_code
        $scope.user.country = x.name
    }

})

const dvsignForm = document.getElementById('dvsignForm');

angular.element(document).ready(function () {

    angular.bootstrap(dvsignForm, ['signForm']);

});

console.log("in script")
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("user is", user)
    }
    else {
        console.log("no user")
    }
});
