'use strict';

angular.module('BeehivePortal')
  .controller('LocationViewController', ['$scope', '$rootScope', '$state', 'AppUtils', 'ThingManagerService', 'PortalService', '$location',function($scope, $rootScope, $state, AppUtils, ThingManagerService, PortalService, $location) {
    $scope.things = [];
    /*
     * dropdown options for loacation.
     */
    $scope.buildingOptions = [];
    $scope.levelOptions = [];
    $scope.roomOptions = [];

    /*
     * page setting
     */
    $location.search({'pageIndex': 1});
    $scope.currentIndex = 1;

    $scope.pageChanged = function(){
        $location.search({'pageIndex': $scope.currentIndex});
    }

    /*
     * Init app
     */
    $scope.init = function(){
        PortalService.getLocation().then(function(response){
            $scope.buildingOptions = response.data;
            $scope.building = $scope.buildingOptions[0];
            $scope.changeBuilding();
        },function(){

        });

        ThingManagerService.getThings().then(function(response){
            $scope.things = response.data;
        },function(){

        });
    };

    /*
     * when building changed
     */

    $scope.changeBuilding = function(){
        $scope.refreshLevels();
    };

    /*
     * when level changed
     */
    
    $scope.refreshLevels = function(){
        $scope.levelOptions = $scope.building.levels;
        $scope.level = $scope.levelOptions[0];

        $scope.refreshRooms();
    }
    $scope.refreshRooms = function(){
        $scope.roomOptions = $scope.level.rooms;
        $scope.room = $scope.roomOptions[0];
    };

    
  }]);
