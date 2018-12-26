const signForm = angular.module('signForm', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});


signForm.controller('AppForm', function ($scope, $http, $location, MemberService) {
    $scope.sign_up_countries = []
    $scope.template = 0;
    $scope.loading = false ;
    $scope.already_exist = false;
    $scope.error_message = ""
    $scope.isDisabled = true;
    $scope.chartIn = false;
    $scope.user  = new CreateUser();
    $scope.logIn = false

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

    document.addEventListener('scroll', function (event) {
        if (event.target.id === 'my_ul') {
            var x = $('#my_ul').scrollTop() + 195
                if(x > $scope.numLimit * 30) {
                    $scope.numLimit = $scope.numLimit + 10
                    $scope.$apply();
                }
        }
        if (event.target.id === 'my_ul_invalid') {
            var x = $('#my_ul_invalid').scrollTop() + 195
            if(x > $scope.numLimit * 30) {
                $scope.numLimit = $scope.numLimit + 10
                $scope.$apply();
            }
        }
        if (event.target.id === 'my_ul_change') {
            var x = $('#my_ul_change').scrollTop() + 195
            if(x > $scope.numLimit * 30) {
                $scope.numLimit = $scope.numLimit + 10
                $scope.$apply();
            }
        }
        if (event.target.id === 'my_ul_provider') {
            var x = $('#my_ul_provider').scrollTop() + 195
            if(x > $scope.numLimit * 30) {
                $scope.numLimit = $scope.numLimit + 10
                $scope.$apply();
            }
        }

    }, true /*Capture event*/);


    $scope.changeNumber = function() {
        $scope.error_message = ""
        $scope.loading = false;
        $scope.code_already_sent = false
        $scope.wrong_code = false
        $scope.code_incomplete = false
        $scope.template = 3;
    }

    // TEMPLATE 0
    $scope.save = function(user,form) {
        console.log("submit",user)
        $scope.code_already_sent = false
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
                        $scope.newFirebaseUser = newFirebaseUser
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
                            //console.log("idToken",idToken)
                            $scope.idToken = idToken
                            MemberService.sendVerifyCode(idToken,user).then(function (results) {
                                console.log("sendVerifyCode",results)
                                $scope.result_verifycode = results
                                if(results.data.status == 0 || results.data.status == 10){
                                    user.verifyData.verify_id = $scope.result_verifycode.data.request_id
                                    user.verifyData.is_verify_code_sent = true
                                    $scope.update_data = {
                                        "verifyData": user.verifyData,
                                        "_id": user._id
                                    }
                                    if(results.data.status == 10){
                                        $scope.code_already_sent = true
                                    }
                                    $scope.verifycode_flag = true
                                }
                                else if(results.data.status == 3){
                                    $scope.verifycode_flag = false
                                    $scope.loading = false;
                                    $scope.template = 2;
                                    $scope.$apply();
                                }
                                return $scope.verifycode_flag
                            })
                            .then((verifycode_flag) => {
                                if(verifycode_flag){
                                    MemberService.updateUser(idToken, $scope.update_data).then(function (results) {
                                        console.log("update",results)
                                        console.log("updateuser",user)
                                        $scope.loading = false;
                                        $scope.wrong_code = false
                                        $scope.code_incomplete = false
                                        $scope.template = 1;
                                        $scope.$apply();
                                    }).catch(function (error) {
                                        $scope.data = error;
                                        $scope.loading = false;
                                        console.log("$scope.data", $scope.data)
                                        $scope.$apply();
                                    })
                                }

                            })
                            .catch(function (error) {
                                $scope.data = error;
                                $scope.loading = false;
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
        $scope.loading = false ;
        $scope.$apply();
        })

    }

    // TEMPLATE 2 - NO VALID
    $scope.sendTel = function(user,form) {
        console.log("sendTel",user)
        $scope.code_already_sent = false
        $scope.error_message = ""

        if(!form.$valid) {
            return;
        }
        $scope.loading = true ;

        MemberService.sendVerifyCode($scope.idToken,user).then(function (results) {
            console.log("sendVerifyCode",results)
            $scope.result_verifycode = results
            if(results.data.status == 0 || results.data.status == 10){
                user.verifyData.verify_id = $scope.result_verifycode.data.request_id
                user.verifyData.is_verify_code_sent = true
                $scope.update_data = {
                    "countryData": user.countryData,
                    "verifyData": user.verifyData,
                    "_id": user._id,
                    "phone_number": user.phone_number,
                }
                if(results.data.status == 10){
                    $scope.code_already_sent = true
                }
                $scope.verifycode_flag = true
            }
            else if(results.data.status == 3){
                $scope.verifycode_flag = false
                $scope.loading = false;
                $scope.error_message = "Invalid number, please enter a real phone number"
                $scope.$apply();
            }
            return $scope.verifycode_flag
        })
        .then((verifycode_flag) => {
            if(verifycode_flag){
                MemberService.updateUser($scope.idToken, $scope.update_data).then(function (results) {
                    console.log("update",results)
                    console.log("updateuser",user)
                    $scope.loading = false;
                    $scope.wrong_code = false
                    $scope.code_incomplete = false
                    $scope.template = 1;
                    $scope.$apply();
                }).catch(function (error) {
                    $scope.data = error;
                    $scope.loading = false;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
                })
            }
        })
        .catch(function (error) {
            $scope.data = error;
            $scope.loading = false;
            console.log("$scope.data", $scope.data)
            $scope.$apply();
        })
    }

    // TEMPLATE 1 - VERIFICATION CODE
    $scope.CodeVerify = function(user,form,code1,code2,code3,code4) {
        //console.log("codeSent")
        $scope.error_message = ""
        $scope.wrong_code = false
        $scope.code_incomplete = false
        $scope.code_already_sent = false

        if(!form.$valid) {
            console.log("invalid")
            $scope.code_incomplete = true
            return;
        }
        $scope.loading = true ;

        $scope.the_code = code1.toString() + code2.toString() + code3.toString() + code4.toString()
        $scope.code_to_send = {
            _id: user._id,
            verify_code: $scope.the_code
        }

        MemberService.checkCode($scope.idToken, $scope.code_to_send).then(function (results) {
            console.log("checkCode",results)
            if(results.data === 'ok'){
                $scope.code_ok = true
                user.verifyData.is_phone_number_verified = true;
                user.verifyData.verify_code = $scope.the_code
                $scope.update_data = {
                    "verifyData": user.verifyData,
                    "_id": user._id
                }
            }
            else{
                $scope.code_ok = false
                $scope.loading = false
                $scope.wrong_code = true
            }
            $scope.$apply();
            return $scope.code_ok
        })
        .then((code_ok) => {
            if(code_ok){
                MemberService.updateUser($scope.idToken, $scope.update_data).then(function (results) {
                    console.log("update",results)
                    console.log("updateuser",user)
                    $scope.loading = false;
                    $scope.wrong_code = false
                    $scope.code_incomplete = false
                    $scope.template = 4;
                    $scope.logIn = true
                    $scope.$apply();
                }).catch(function (error) {
                    $scope.data = error;
                    $scope.loading = false;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
                })
            }
        })
        .catch(function (error) {
            $scope.data = error;
            $scope.loading = false;
            console.log("$scope.data", $scope.data)
            $scope.$apply();
        })
    }

    // TEMPLATE 3 - CHANGE NUMBER
    $scope.ChangePhoneNumber = function(user,form) {
        console.log("savePhone",user)
        $scope.error_message = ""
        $scope.code_already_sent = false
        $scope.wrong_code = false
        $scope.code_incomplete = false

        if(!form.$valid) {
            return;
        }
        $scope.loading = true ;

        MemberService.sendVerifyCode($scope.idToken,user).then(function (results) {
            console.log("sendVerifyCode",results)
            $scope.result_verifycode = results
            if(results.data.status == 0 || results.data.status == 10){
                user.verifyData.verify_id = $scope.result_verifycode.data.request_id
                user.verifyData.is_verify_code_sent = true
                $scope.update_data = {
                    "countryData": user.countryData,
                    "verifyData": user.verifyData,
                    "_id": user._id,
                    "phone_number": user.phone_number,
                }
                if(results.data.status == 10){
                    $scope.code_already_sent = true
                }
                $scope.verifycode_flag = true
            }
            else if(results.data.status == 3){
                $scope.verifycode_flag = false
                $scope.loading = false;
                $scope.error_message = "Invalid number, please enter a real phone number"
                $scope.$apply();
            }
            return $scope.verifycode_flag
        })
        .then((verifycode_flag) => {
            if(verifycode_flag){
                MemberService.updateUser($scope.idToken, $scope.update_data).then(function (results) {
                    console.log("update",results)
                    console.log("updateuser",user)
                    $scope.loading = false;
                    $scope.wrong_code = false
                    $scope.code_incomplete = false
                    $scope.template = 1;
                    $scope.$apply();
                }).catch(function (error) {
                    $scope.data = error;
                    $scope.loading = false;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
                })
            }
        })
        .catch(function (error) {
             $scope.data = error;
             $scope.loading = false;
             console.log("$scope.data", $scope.data)
             $scope.$apply();
        })
    }

    // TEMPLATE 5 - SAVE PROVIDER
    $scope.save_provider = function(user,form) {
        console.log("save_provider",user)
        $scope.error_message = ""
        $scope.code_already_sent = false

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
                MemberService.sendVerifyCode($scope.idToken,user).then(function (results) {
                    console.log("sendVerifyCode",results)
                    $scope.result_verifycode = results
                    if(results.data.status == 0|| results.data.status == 10){
                        user.verifyData.verify_id = $scope.result_verifycode.data.request_id
                        user.verifyData.is_verify_code_sent = true
                        $scope.update_data = {
                            "_id": user._id,
                            "countryData": user.countryData,
                            "verifyData": user.verifyData,
                            "phone_number": user.phone_number,
                            "nickname":user.nickname
                        }
                        if(results.data.status == 10){
                            $scope.code_already_sent = true
                        }
                        $scope.verifycode_flag = true
                    }
                    else if(results.data.status == 3){
                        $scope.verifycode_flag = false
                        $scope.loading = false;
                        $scope.template = 2;
                        $scope.$apply();
                    }
                    return $scope.verifycode_flag
                })
                .then((verifycode_flag) => {
                    if(verifycode_flag){
                        MemberService.updateUser($scope.idToken, $scope.update_data).then(function (results) {
                            console.log("update",results)
                            console.log("updateuser",user)
                            $scope.loading = false;
                            $scope.wrong_code = false
                            $scope.code_incomplete = false
                            $scope.template = 1;
                            $scope.$apply();
                        }).catch(function (error) {
                            $scope.data = error;
                            $scope.loading = false;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })
                    }
                })
                .catch(function (error) {
                    $scope.data = error;
                    $scope.loading = false;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
                })
            }
        })
        .catch(function (error) {
                $scope.data = error;
                $scope.loading = false ;
                $scope.$apply();
        })

    }

    //***************************************
    $scope.SignInProvider = function(provider) {
        console.log("in SignInProvider",provider)
        $scope.loading = true ;
        $scope.user  = new CreateUser();
        $scope.user.countryData.country = $scope.location
        $scope.user.countryData.dial_code =  $scope.location_code

        if(provider == 'facebook'){
            $scope.provider = new firebase.auth.FacebookAuthProvider();
        }
        else if(provider == 'google'){
            $scope.provider = new firebase.auth.GoogleAuthProvider();
        }
        firebase.auth().signInWithPopup($scope.provider).then((profilFB) => {
            console.log("profilFB",profilFB);
            $scope.profilFB = profilFB
            profilFB.user.getIdToken(true).then(function (idToken) {
                //console.log("idToken",idToken)
                $scope.idToken = idToken
                $scope.id_to_send = {
                    _id: profilFB.user.uid
                }
                MemberService.getUsersById($scope.idToken, $scope.id_to_send).then(function (results) {
                    console.log("getUsersById",results)
                    if(results.data.error == 'no user with this id.'){
                        $scope.user.full_name = "no name";
                        if (profilFB.user.displayName != null) {
                            $scope.user.full_name = profilFB.user.displayName;}
                        $scope.user.email = profilFB.user.email;
                        $scope.user._id = profilFB.user.uid;
                        $scope.user.provider = provider;
                        $scope.user.createAccountDate = new Date().toLocaleDateString();
                        $scope.userInDb = true
                    }
                    else{
                        if(results.data.verifyData.is_phone_number_verified){
                            console.log("in verify",results.data.verifyData.is_phone_number_verified)
                            $scope.user = results.data
                            $scope.loading = false ;
                            $scope.template = 4
                            $scope.logIn = true
                            $('.modal_sigh-in').slideUp();
                            $scope.template = 0;
                            reset()
                        }
                        else{
                            $scope.user = results.data
                            $scope.loading = false ;
                            $scope.template = 1
                            $('.modal_sigh-up').slideDown();
                            $scope.template = 0;
                            reset()
                        }
                        $scope.userInDb = false
                    }
                    $scope.$apply();
                    return $scope.userInDb
                })
                .then((userInDb) => {
                    if(userInDb){
                        console.log("$scope.user",$scope.user)
                        MemberService.createUser($scope.user).then(function (results) {
                            console.log("create",results)
                            $scope.loading = false ;
                            $scope.template = 5
                            $('.modal_sigh-up').slideDown();
                            $scope.$apply();
                        }).catch(function (error) {
                            $scope.data = error;
                            $scope.loading = false;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })
                    }
                })
                .catch(function (error) {
                    $scope.data = error;
                    $scope.loading = false;
                    console.log("$scope.data", $scope.data)
                    $scope.$apply();
                })
            }).catch(function (error) {
            $scope.loading = false;
            console.log('ERROR: ', error)
            });

        }).catch((err) => {
            $scope.data = err;
            $scope.loading = false;
            console.log("$scope.data", $scope.data)
        })
    }

    //***************************************
    $scope.master = {};
    $scope.reset = function(form) {
        console.log("reset form",form)
        //
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.user = new CreateUser()
        $scope.template = 0;
        $scope.error_message= ""
        $scope.loading = false;
        $scope.wrong_code = false
        $scope.code_incomplete = false
        $scope.code_already_sent = false
        // $scope.user  = angular.copy($scope.master);
        $scope.user.countryData.country = $scope.location
        $scope.user.countryData.dial_code = $scope.location_code
        // $scope.user.full_name = ""
        // $scope.user.nickname = ""
        // $scope.user.password = ""
        $scope.error_message_signIn = ""
        $scope.user.email = ""
        $scope.user.phone_number = ""
    };
    $scope.reset();

    $scope.setValue = function(x) {
        $scope.user.countryData.dial_code = x.dial_code
        $scope.user.countryData.country = x.name
    }

//**************** SIGN IN   ****************************************************************************************************
    $scope.loading_signIn = false ;
    $scope.already_exist_signIn = false;
    $scope.error_message_signIn = ""
    $scope.isDisabled_signIn = true;

    $scope.signIn = function(user,form) {
        console.log("signIn",user)
        $scope.error_message_signIn = ""

        if(!form.$valid) {
            return;
        }
        $scope.loading = true ;

        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
            .then((profilFB) => {
                console.log("profilFB",profilFB);
                $scope.profilFB = profilFB
                profilFB.user.getIdToken(true).then(function (idToken) {
                    //console.log("idToken",idToken)
                    $scope.idToken = idToken
                    $scope.id_to_send = {
                        _id: profilFB.user.uid
                    }
                    MemberService.getUsersById($scope.idToken, $scope.id_to_send).then(function (results) {
                        console.log("getUsersById",results)
                        if(results.data.error == 'no user with this id.'){
                            $scope.user.full_name = "no name";
                            if (profilFB.user.displayName != null) {
                                $scope.user.full_name = profilFB.user.displayName;}
                            $scope.user.email = profilFB.user.email;
                            $scope.user._id = profilFB.user.uid;
                            $scope.user.provider = provider;
                            $scope.user.createAccountDate = new Date().toLocaleDateString();
                            $scope.userInDb = true
                        }
                        else{
                            // $scope.user.provider = provider;
                            if(results.data.verifyData.is_phone_number_verified){
                                console.log("in verify",results.data.verifyData.is_phone_number_verified)
                                $scope.loading = false ;
                                $scope.logIn = true
                                $('.modal_sigh-in').slideUp();
                                reset()
                            }
                            else{
                                $scope.user = results.data
                                $scope.loading = false ;
                                $scope.wrong_code = false
                                $scope.code_incomplete = false
                                $scope.template = 1
                                $('.modal_sigh-up').slideDown();
                                reset()
                            }
                            $scope.userInDb = false
                        }
                        $scope.$apply();
                        return $scope.userInDb
                    })
                        .then((userInDb) => {
                            if(userInDb){
                                MemberService.createUser($scope.user).then(function (results) {
                                    console.log("create",results)
                                    $scope.loading = false ;
                                    $scope.template = 5
                                    $('.modal_sigh-up').slideDown();
                                    reset()
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
                            $scope.loading = false ;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })
                }).catch(function (error) {
                    console.log('ERROR: ', error)
                });
            })
            .catch(err => {
                $scope.data = err;
                $scope.loading = false;
                console.log("$scope.data", $scope.data)
                switch (err.code) {
                    case "auth/user-not-found":
                        $scope.error_message_signIn = "This email doesn't have account."
                        break;
                    case "auth/wrong-password":
                        $scope.error_message_signIn = "Wrong password."
                    default:
                        $scope.error_message_signIn = "The email or the Password is wrong. Or you " +
                            "don't have a password (it can happens if you connected with google of facebook on your last connexion).";
                        break;
                }
                $scope.$apply();
            })
    }


    //**********************************************************************

})


signForm.directive("moveNextOnMaxlength", function() {
    return {
        restrict: "A",
        link: function($scope, element) {
            element.on("input", function(e) {
                if(element.val().length == element.attr("maxlength")) {
                    var $nextElement = element.next();
                    if($nextElement.length) {
                        $nextElement[0].focus();
                    }
                }
            });
        }
    }
});

//
// signForm.directive('valid', function () {
//     return {
//         restrict: "A",
//         require: 'ngModel',
//         link: function (scope, element, attributes, control) {
//             control.$validators.valid = function (modelValue, viewValue) {
//                 var chartIn = true
//                 if (control.$isEmpty(modelValue) || modelValue.length<5)
//                 {
//                     return true;
//                 }
//                 var phone_number = viewValue;
//                 for (var i = 0; i < phone_number.length; i++) {
//                     if(isNaN(parseInt(phone_number.charAt(i)))){
//                         chartIn = false
//                     }
//                 }
//                 return  chartIn
//             };
//         }
//     };
// });

const dvsignForm = document.getElementById('dvsignForm');

angular.element(document).ready(function () {

    angular.bootstrap(dvsignForm, ['signForm']);

})

//console.log("in script")
// firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//         console.log("user is",user)
//     }
//     else {
//         console.log("no user")
//     }
// });
