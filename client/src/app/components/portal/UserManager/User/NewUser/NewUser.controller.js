'use strict';

angular.module('BeehivePortal')
  .controller('NewUserController', ['$scope', '$rootScope', '$state', 'AppUtils', 'PortalService',function($scope, $rootScope, $state, AppUtils, PortalService) {
    // TODO
    $scope.sexOptions = [{
        id: 1,
        text:'男'
    },{
        id: 2,
        text: '女'
    }];


    /*
     * dropdown options for loacation.
     */
    $scope.buildingOptions = [];
    $scope.levelOptions = [];
    $scope.roomOptions = [];

    /*
     * user object for registration.
     */
    $scope.newUser = {
        name: '',
        sex: {},
        identity: null,
        company: null,
        building: null,
        level: null,
        room: null,
        phone: null
    };

    /*
     * init data
     */
    
    $scope.init = function(){
        PortalService.getLocation().then(function(response){
            $scope.buildingOptions = response.data;
            $scope.newUser.building = $scope.buildingOptions[0];
            $scope.changeBuilding();
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
        $scope.levelOptions = $scope.newUser.building.levels;
        $scope.newUser.level = $scope.levelOptions[0];

        $scope.refreshRooms();
    }
    $scope.refreshRooms = function(){
        $scope.roomOptions = $scope.newUser.level.rooms;
        $scope.newUser.room = $scope.roomOptions[0];
    };

  }]);
