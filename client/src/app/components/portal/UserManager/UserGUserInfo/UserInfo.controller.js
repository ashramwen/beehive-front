'use strict';

angular.module('BeehivePortal')
  .controller('UserInfoController', ['$scope', '$rootScope', '$state', 'AppUtils', 'PortalService', 'UserService',function($scope, $rootScope, $state, AppUtils, PortalService, UserService) {
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
    $scope.user = {
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
            $scope.user.building = $scope.buildingOptions[0];
            $scope.changeBuilding();

            UserService.getUser().then(function(response){
                $scope.user = response.data;
                $scope.user.building = _.find($scope.buildingOptions,function(option){
                    return option.id == $scope.user.address.building.id;
                });
                $scope.user.level = _.find($scope.user.building.levels,function(level){
                    return level.id == $scope.user.address.level.id;
                });
                $scope.user.room = _.find($scope.user.level.rooms,function(room){
                    return room.id == $scope.user.address.room.id;
                });
            },function(){

            });
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
        $scope.levelOptions = $scope.user.building.levels;
        $scope.user.level = $scope.levelOptions[0];

        $scope.refreshRooms();
    }
    $scope.refreshRooms = function(){
        $scope.roomOptions = $scope.user.level.rooms;
        $scope.user.room = $scope.roomOptions[0];
    };

    $scope.goThingAuth = function(){
        $scope.navigateTo($scope.otherNavs.USER_THING_AUTH, $scope.$state.params);
    };
  }]);
