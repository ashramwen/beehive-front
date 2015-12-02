'use strict';

angular.module('BeehivePortal')
  .controller('TypeViewController', ['$scope', '$rootScope', '$state', 'AppUtils', 'ThingManagerService',function($scope, $rootScope, $state, AppUtils, ThingManagerService) {
    /*
     * define variables
     */
    
    $scope.thingTypes = []

    $scope.init = function(){
        ThingManagerService.getTypes().then(function(response){
            $scope.thingTypes = response.data;
        },function(){

        });
    };

    $scope.viewThings = function(type){
        $scope.navigateTo($scope.otherNavs.THING_LIST,{id: type.name});
    }

  }]);
