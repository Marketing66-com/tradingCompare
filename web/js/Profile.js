var ProfileApp = angular.module('ProfileApp', ['memberService']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

ProfileApp.controller('ProfileController', function($scope,MemberService) {
    $scope.tab = 5;
    $scope.setTab = function(newTab){
        $scope.tab = newTab;
    };
    $scope.isSet = function(tabNum){
        return $scope.tab === tabNum;
    };

    $scope.the_bio_description = '';

    $scope.init = function (id) {
        console.log('id********',id)
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $scope.userLoggedIn = true;
                user.getIdToken(true).then(function (idToken) {
                    $scope.idToken = idToken
                    $scope.id = user.uid
                    $scope.user_id = {
                        _id: user.uid
                    }
                    MemberService.getUsersById($scope.idToken, $scope.user_id).then(function (results) {
                        $scope.user = results.data
                        if($scope.user.description == ""){
                            $scope.the_bio_description = '- No description yet - Click here to fill your description'
                        }
                        else{
                            $scope.the_bio_description = $scope.user.description
                        }

                        console.log("$scope.user",  $scope.user)
                        $scope.$apply();
                    })
                        .catch(function (error) {
                            $scope.data = error;
                            console.log("$scope.data", $scope.data)
                            $scope.$apply();
                        })
                }).catch(function (error) {
                    console.log('ERROR: ', error)
                });
                $scope.$apply();
            }
            else{
                $scope.userLoggedIn = false;
                $scope.$apply();
            }
        });
    }
    //*********************************************************************************
});

ProfileApp.directive('clickToEdit', function($timeout,MemberService) {
    return {
        require: 'ngModel',
        scope: {
            model: '=ngModel',
            idToken: '=tIdtoken',
            id: '=tUserid',
            type: '@type'
        },
        replace: true,
        transclude: false,
        template:
        '<div class="templateRoot">'+
        '<div class="hover-edit-trigger" title="click to edit">'+
        '<div class="hover-text-field" ng-show="!editState" ng-click="toggle()">{[{model}]}<div class="edit-pencil glyphicon glyphicon-pencil"></div></div>'+
        '<input style="width: 100%;" class="inputText" type="text" ng-model="localModel" ng-enter="save()" ng-show="editState && type == \'inputText\'" />' +
        '</div>'+
        '<div class="edit-button-group pull-right" ng-show="editState">'+
        '<div class="glyphicon glyphicon-ok"  ng-click="save()"></div>'+
        '<div class="glyphicon glyphicon-remove" ng-click="cancel()"></div>'+
        '</div>'+
        '</div>',
        link: function (scope, element, attrs) {
            scope.editState = false;
            scope.localModel = scope.model;

            scope.$watch('model', function(newval, oldval){
                scope.localModel = scope.model;
            })

            scope.save = function(){

                if(scope.localModel == undefined ||
                    typeof scope.localModel == "undefined" ||
                    scope.localModel== "" ||
                    scope.localModel== "- No description yet - Click here to fill your description"){
                    // console.log('in else')
                    scope.localModel = scope.model;
                    scope.toggle();
                }
                else{
                    // console.log('in if')
                    scope.model = scope.localModel;
                    scope.update_data = {
                        "description":  scope.model,
                        "_id":  scope.id
                    }

                    MemberService.updateUser(scope.idToken, scope.update_data).then(function (results) {
                        console.log("update",results)
                    }).catch(function (error) {
                        scope.data = error;
                        console.log("scope.data", scope.data)
                    })

                    scope.toggle();
                }
            };

            scope.cancel = function(){
                scope.localModel = scope.model;
                scope.toggle();
            }

            scope.toggle = function () {
                scope.editState = !scope.editState;

                var x1 = element[0].querySelector("."+scope.type);
                $timeout(function(){
                    scope.editState ? x1.focus() : x1.blur();
                }, 0);
            }
        }
    }
});

ProfileApp.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

var dvProfile = document.getElementById('dvProfile');
angular.element(document).ready(function() {
    angular.bootstrap(dvProfile, ['ProfileApp']);
});

