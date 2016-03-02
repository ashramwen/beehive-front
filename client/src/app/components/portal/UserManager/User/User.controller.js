'use strict';

angular.module('BeehivePortal')
  .controller('UserController', ['$scope', '$rootScope', '$state', 'AppUtils',function($scope, $rootScope, $state, AppUtils) {
    // TODO
  }]);



angular.module('BeehivePortal')
  .controller('UserController.EditUser',function ($scope, $uibModalInstance, user, $$User, PortalService) {
    
    $scope.user = user;
    PortalService.getLocation().then(function(response){
        $scope.buildingOptions = response.data;
        $scope.changeBuilding();
    },function(){

    });

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
        $scope.levelOptions = $scope.user.custom.building.levels;
        $scope.user.custom.level = $scope.levelOptions[0];

        $scope.refreshRooms();
    }
    $scope.refreshRooms = function(){
        $scope.roomOptions = $scope.user.custom.level.rooms;
        $scope.user.custom.room = $scope.roomOptions[0];
    };

    $scope.ok = function () {
        $$User.update(user, function(user){
            $uibModalInstance.close($scope.user);
            console.log('save user succeeded!')
        }, function(){
            console.log('failed to save user!');
        });
        
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  });