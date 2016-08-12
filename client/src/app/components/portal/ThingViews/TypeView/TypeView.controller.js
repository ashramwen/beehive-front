'use strict';

angular.module('BeehivePortal')
  .controller('TypeViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Type', '$uibModal', 'TriggerDetailService',function($scope, $rootScope, $state, AppUtils, $$Type, $uibModal, TriggerDetailService) {
    /*
     * define variables
     */
    
    $scope.thingTypes = [];

    $scope.init = function(){
        $$Type.getAll(function(types){
            $scope.thingTypes = types;
            _.each(types, function(type){

                $$Type.getSchema({type: type.type}, function(schema){
                    schema = TriggerDetailService.parseSchema(schema);
                    type.displayName = schema.displayName;
                });
            });
        });
    };

    $scope.viewThings = function(type){
        $scope.navigateTo($scope.navMapping.TYPE_THING_LIST,{typeName: type.type, from: 'type'});
    };

    /*
     * show edit modal
     */
    
    $scope.editType = function(type){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/ThingViews/TypeView/EditType.template.html',
            controller: 'TypeViewController.EditType',
            size: 'lg',
            resolve: {
                type: _.clone(type)
            }
        });

        modalInstance.result.then(function (myType) {
        }, function () {
        });
    };

  }])
  .controller('TypeViewController.EditType',['$scope', '$http', '$uibModalInstance', 'type', '$$Type', '$timeout', '$q', function($scope, $http, $uibModalInstance, type, $$Type, $timeout, $q){
    
    $scope.schema = {};
    var editor;

    $scope.init = function(){
        var $defer = new Promise(function(resolve, reject){
            $timeout(function(){
                var container = document.getElementById("jsoneditor");
                var options = {mode: 'code'};
                editor = new JSONEditor(container, options);
                resolve(editor);
            },50);
        });

        $scope.type = type;

        var schemaQuery = $$Type.getSchema({type: type.type}).$promise;

        $q.all([$defer, schemaQuery]).then(function(result){
            var schema = result[1];
            if(!schema.name) $scope.schema = null;
            $scope.schema = schema;
            
            editor.set(schema);
        });
        
    };

    

    $scope.propertyRequired = function(property, required){
        return !! _.find(required, function(propertyName){
          return propertyName == property;
        });
    };

    $scope.ok = function(){
        var schemaContent = editor.get(),
            schema = {
                thingType: $scope.type.type,
                name: $scope.type.type,
                version: schemaContent.version,
                content: schemaContent.content
            };
        if($scope.schema && $scope.schema.id){
            schema.id = $scope.schema.id;
            $$Type.updateSchema(schema, function(){
                $uibModalInstance.close($scope.type); 
            });
        }else{
            $$Type.saveSchema(schema, function(){
                $uibModalInstance.close($scope.type);  
            });
        }
        
        
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  }]);
