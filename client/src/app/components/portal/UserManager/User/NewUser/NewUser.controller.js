'use strict';

angular.module('BeehivePortal')
  .controller('NewUserController', ['$scope', '$rootScope', '$state', 'AppUtils',function($scope, $rootScope, $state, AppUtils) {
    // TODO
    $scope.sexOptions = [{
        id: 1,
        text:'男'
    },{
        id: 2,
        text: '女'
    }];

    var tmpLocation = [
        {
            id: 1,
            building:"A",
            levels:[{
                id: 1,
                name: 1,
                rooms:[{
                    id:1,
                    name: 101
                },{
                    id:2,
                    name: 102
                }]
            },{
                id: 2,
                name: 2,
                rooms:[{
                    id:3,
                    name: 201
                },{
                    id:4,
                    name: 202
                }]
            }]
        },
        {
            id: 2,
            building:"B",
            levels:[{
                id: 3,
                name: 1,
                rooms:[{
                    id:1,
                    name: 101
                },{
                    id:2,
                    name: 102
                }]
            },{
                id: 4,
                name: 3,
                rooms:[{
                    id:3,
                    name: 301
                },{
                    id:4,
                    name: 302
                }]
            }]
        }
    ];



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
        $scope.buildingOptions = tmpLocation;
        $scope.newUser.building = $scope.buildingOptions[0];
        $scope.changeBuilding();
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
