'use strict';

angular.module('BeehivePortal')
  .controller('NewUserController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', 'PortalService',function($scope, $rootScope, $state, AppUtils, $$User, PortalService) {
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
        userID: '',
        userName: '', // required
        phone: '',
        mail: '',
        company: '',
        role: '4', // required
        custom: {
          sex: {},
          id: "",
          building: null,
          level: null,
          room: null
        }
    }

    /*
     * init data
     */
    
    $scope.init = function(){
        PortalService.getLocation().then(function(response){
            $scope.buildingOptions = response.data;
            $scope.newUser.custom.building = $scope.buildingOptions[0];
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
        $scope.levelOptions = $scope.newUser.custom.building.levels;
        $scope.newUser.custom.level = $scope.levelOptions[0];

        $scope.refreshRooms();
    }
    $scope.refreshRooms = function(){
        $scope.roomOptions = $scope.newUser.custom.level.rooms;
        $scope.newUser.custom.room = $scope.roomOptions[0];
    };

    /*
     * create user
     */
    $scope.createUser = function(){
        $$User.create($scope.newUser, function(){
            $scope.navigateTo($scope.navMapping.USER_LIST);
        },function(response){
            if(response.status == 409)
            console.log(response);
            AppUtils.alert('User ID exists!');
        });
    }
  }]);
