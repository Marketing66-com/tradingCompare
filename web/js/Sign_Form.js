const signForm = angular.module('signForm', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

signForm.controller('AppForm', function ($scope, $http, $location, MemberService) {
    $scope.sign_up_countries = []
    $scope.template = 0;
    $scope.loading = false ;
    $scope.already_exist = false;
    $scope.error_message = ""
    $scope.isDisabled = true;

    $scope.user  = new CreateUser();

    $scope.init = function () {
        $scope.numLimit = 10

        MemberService.getLocation().then(function (country) {

            $scope.location = country.country_name;
            $scope.user.countryData.country = country.country_name;
            $scope.location_code =  "+" + country.location.calling_code
            $scope.user.countryData.dial_code = "+" + country.location.calling_code

            $http.get('/js/countries.json').
            success(function(data, status, headers, config) {

                for(i=0;i<data.countries.length;i++){
                    $scope.sign_up_countries[i] = {
                        name: data.countries[i].name,
                        img: data.countries[i].name.replace(/ /g, "-").toLocaleLowerCase(),
                        dial_code: data.countries[i].dial_code,
                        code: data.countries[i].code,
                    }
                }
            });
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


    $scope.save = function(user,form) {
        console.log("submit",user)
        $scope.error_message = ""

        if(!form.$valid) {
            return;
        }
        $scope.loading = true ;

        MemberService.is_nickname_exist(user.nickname).then(function (results) {
            if(results){
                $scope.already_exist = true;
                $scope.loading = false ;
            }
            else{
                $scope.already_exist = false;
                // $scope.loading = false ;
            }
            $scope.$apply();
            return $scope.already_exist

        }).then((IsAlready_exist)=>{
            if(!IsAlready_exist){
                // $scope.loading = true;
                firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                    .then((newFirebaseUser) => {
                        user._id = newFirebaseUser.user.uid;
                        user.provider = "password";
                        user.createAccountDate = new Date().toLocaleDateString();
                        return newFirebaseUser
                    })
                    .then((newFirebaseUser) => {
                        MemberService.createUser(user).then(function (results) {
                            console.log("create",results)

                        }).catch(function (error) {
                            $scope.data = error;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })
                        return newFirebaseUser
                    })
                    .then((newFirebaseUser) => {
                        newFirebaseUser.user.getIdToken(true).then(function (idToken) {
                            MemberService.sendVerifyCode(idToken,user).then(function (results) {
                                console.log("sendVerifyCode",results)
                                $scope.result_verifycode = results
                                if(results.data.status == 0){
                                    user.verifyData.verify_id = $scope.result_verifycode.data.request_id
                                    user.verifyData.is_verify_code_sent = true
                                    $scope.update_data = {
                                        "verifyData": user.verifyData,
                                        "_id": user._id
                                    }
                                    $scope.verifycode_flag = true
                                }
                                else{
                                    $scope.verifycode_flag = false
                                    $scope.loading = false;
                                    $scope.error_message = "problem with sending code!"
                                    $scope.$apply();
                                    // error_text: "Concurrent verifications to the same number are not allowed"
                                    // status: "10"
                                }
                                return $scope.verifycode_flag
                            })
                            .then((verifycode_flag) => {
                                if(verifycode_flag){
                                    MemberService.updateUser(idToken, $scope.update_data).then(function (results) {
                                        console.log("update",results)
                                        console.log("updateuser",user)
                                        $scope.loading = false;
                                        $scope.template = 1;
                                        $scope.$apply();
                                    }).catch(function (error) {
                                        $scope.data = error;
                                        console.log("$scope.data", $scope.data)
                                        $scope.$apply();
                                    })
                                }

                            })
                            .catch(function (error) {
                                $scope.data = error;
                                console.log("$scope.data", $scope.data)
                                $scope.$apply();
                            })
                        }).catch(function (error) {
                            console.log('ERROR: ', error)
                        });
                    })
                    .catch(err => {
                        $scope.data = err;
                        if($scope.data.code == 'auth/email-already-in-use'){
                            $scope.error_message = $scope.data.message
                        }
                        $scope.loading = false;
                        console.log("$scope.data", $scope.data)
                        $scope.$apply();
                    })
            }
        })
        .catch(function (error) {
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
        $scope.user.countryData.country = $scope.location
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
        $scope.user.countryData.country = x.name
    }

})

const dvsignForm = document.getElementById('dvsignForm');

angular.element(document).ready(function () {

    angular.bootstrap(dvsignForm, ['signForm']);

});

// console.log("in script")
// firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//         console.log("user is", user)
//     }
//     else {
//         console.log("no user")
//     }
// });
