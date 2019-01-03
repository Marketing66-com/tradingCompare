var App = angular.module('plunker', ['ui.bootstrap']).config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});

App.controller("ListCtrl", function ($scope,$dialog) {

    $scope.items = [
        {name: 'foo', value: 'foo value'},
        {name: 'bar', value: 'bar value'},
        {name: 'baz', value: 'baz value'}
    ];

    var dialogOptions = {
        controller: 'EditCtrl',
        templateUrl: '/js/sentiment_already_exist.html'
    };

    $scope.edit = function(item){
        console.log("edit", item)
        var itemToEdit = item;

        // $('.modal').style["display"] = ""
        $dialog.dialog(angular.extend(dialogOptions,
            {
                resolve:
                    {item: angular.copy(itemToEdit)}
            }
            )
        )
            .open()
            .then(function(result) {
                if(result) {
                    angular.copy(result, itemToEdit);
                }
                itemToEdit = undefined;
            });
    };
})


App.controller("EditCtrl", function ($scope,dialog,item) {
    $scope.item = item;

    $scope.save = function() {
        dialog.close($scope.item);
    };

    $scope.close = function(){
        dialog.close(undefined);
    };
})

var dv = document.getElementById('dv');

angular.element(document).ready(function() {

    angular.bootstrap(dv, ['plunker']);
});

//
// angular.module('plunker', ['ui.bootstrap']).config(function ($interpolateProvider) {
//     $interpolateProvider.startSymbol('{[{').endSymbol('}]}');});
//
// function ListCtrl($scope, $dialog) {
//
//     $scope.items = [
//         {name: 'foo', value: 'foo value'},
//         {name: 'bar', value: 'bar value'},
//         {name: 'baz', value: 'baz value'}
//     ];
//
//     var dialogOptions = {
//         controller: 'EditCtrl',
//         templateUrl: '/js/sentiment_already_exist.html'
//     };
//
//     $scope.edit = function(item){
//
//         var itemToEdit = item;
//
//         $dialog.dialog(angular.extend(dialogOptions, {resolve: {item: angular.copy(itemToEdit)}}))
//             .open()
//             .then(function(result) {
//                 if(result) {
//                     angular.copy(result, itemToEdit);
//                 }
//                 itemToEdit = undefined;
//             });
//     };
// }
// //the dialog is injected in the specified controller
// function EditCtrl($scope, item, dialog){
//
//     $scope.item = item;
//
//     $scope.save = function() {
//         dialog.close($scope.item);
//     };
//
//     $scope.close = function(){
//         dialog.close(undefined);
//     };
// }
//
//

