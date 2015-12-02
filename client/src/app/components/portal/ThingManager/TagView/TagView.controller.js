'use strict';

angular.module('BeehivePortal')
  .controller('TagViewController', ['$scope', '$rootScope', '$state', 'AppUtils', 'ThingManagerService', function($scope, $rootScope, $state, AppUtils, ThingManagerService) {
    /*
     * define variables
     */
    
    $scope.thingTags = []

    $scope.init = function(){
        ThingManagerService.getTags().then(function(response){
            $scope.thingTags = response.data;
        },function(){

        });
    };

    $scope.viewThings = function(tag){
        $scope.navigateTo($scope.otherNavs.THING_LIST,{id: tag.name});
    }
  }]);
