'use strict';

angular.module('BeehivePortal')
  .controller('UserInfoController', ['$scope', '$rootScope', '$state', 'AppUtils', 'PortalService', '$$UserManager', '$uibModal', function($scope, $rootScope, $state, AppUtils, PortalService, $$UserManager, $uibModal) {
    /*
     * init data
     */
    var fromUserGroup = false;
    $scope.init = function(){
        
        if($state.current.name == $scope.navMapping['GROUP_USER_INFO'].state){
            fromUserGroup = true;
        }

        $scope.user = $$UserManager.get({},{userID: $state.params['userID']});
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
        if(fromUserGroup){
            $scope.navigateTo($scope.navMapping.GROUP_USER_THING_AUTH, $scope.$state.params);
        }else{
            $scope.navigateTo($scope.navMapping.USER_THING_AUTH, $scope.$state.params);
        }
    };

    $scope.goThingACL = function(){
        if(fromUserGroup){
            $scope.navigateTo($scope.navMapping.GROUP_USER_THING_ACL, $scope.$state.params);
        }else{
            $scope.navigateTo($scope.navMapping.GROUP_USER_THING_ACL, $scope.$state.params);
        }
    };

    $scope.editUser = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/UserManager/User/EditUser.template.html',
            controller: 'UserController.EditUser',
            size: 'lg',
            resolve: {
              user: function () {
                return $scope.user;
              }
            }
        });

        modalInstance.result.then(function (user) {
            $scope.user = user;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deleteUser = function(){
        $$UserManager.remove({},$scope.user,function(){
            $scope.navigateTo($scope.navMapping.USER_LIST);
        },function(response){
            AppUtils.alert(response.statusText);
        })
    };
    
  }]);
