'use strict';

angular.module('BeehivePortal')
  .controller('AddThingController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$timeout', '$$Supplier', 'ThingErrorHandler', function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type, $timeout, $$Supplier, ThingErrorHandler) {
    $scope.types = [];
    var editor;

    $scope.init = function(){
        $rootScope.$watch('login', function(newVal){
            if(!newVal) return;
            $scope.types = [];
            $$Type.getAll(function(types){
                $scope.types = _.pluck(types, 'type');
            });
            $scope.thing = new BeehiveThing();
            $scope.suppliers = $$Supplier.getAll(function(suppliers){
                $scope.thing.kiiAppID = suppliers[0].relationAppID;
            });
        });
    };

    $scope.saveThing = function(thing){

        $$Thing.save(thing, function(){
            AppUtils.alert('保存成功！', '提示信息');
        }, function(response){
            ThingErrorHandler.handle(response.data.errorCode);
        });
    };

  }]);