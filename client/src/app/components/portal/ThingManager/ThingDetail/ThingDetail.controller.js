'use strict';

angular.module('BeehivePortal')
  .controller('ThingDetailController', ['$scope', '$rootScope', '$state', 'AppUtils', 'ThingManagerService',function($scope, $rootScope, $state, AppUtils, ThingManagerService) {
    $scope.thing = {};

    $scope.init = function(){
        ThingManagerService.getThingById().then(function(response){
            $scope.thing = response.data;
            $scope.thing._tags = _.pluck($scope.thing.tags,'name');
            console.log(response.data);
        },function(){

        });
    }
  }]);
