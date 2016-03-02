'use strict';

angular.module('BeehivePortal')
  .controller('TypeViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Type', '$uibModal',function($scope, $rootScope, $state, AppUtils, $$Type, $uibModal) {
    /*
     * define variables
     */
    
    $scope.thingTypes = []

    $scope.init = function(){
      if(!$scope.PermissionControl.allowAction('SEARCH_TYPES'))return false;
        $scope.thingTypes = $$Type.getAll();


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
            templateUrl: 'app/components/portal/ThingManager/TypeView/EditType.template.html',
            controller: 'TypeViewController.EditType',
            size: 'lg',
            resolve: {
                type: _.clone(type)
            }
        });

        modalInstance.result.then(function (myType) {
            _.extend(tag,myType);
        }, function () {
            
        });
    };

  }])
  .controller('TypeViewController.EditType',['$scope', '$http', '$uibModalInstance', 'type', function($scope, $http, $uibModalInstance, type){
    
    $http({
        method: 'GET',
        url:'http://114.215.196.178:8080/demohelper/api/industrytemplate?thingType=demoThingType&name=demoName&version=demoVer'}
    ).then(function(response){
        $scope.schema = response.data;

        $scope.schemaString = JSON.stringify($scope.schema, null, 4);
        $scope.type = type;
        
        console.log($scope.schema);
    });

    $scope.propertyRequired = function(property, required){
        required[property]
        return !! _.find(required, function(propertyName){
          return propertyName == property;
        });
    };

    $scope.ok = function(){
        $uibModalInstance.close($scope.type);  
    };

      

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  }]);
