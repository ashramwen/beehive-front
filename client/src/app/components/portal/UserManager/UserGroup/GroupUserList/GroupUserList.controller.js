'use strict';

angular.module('BeehivePortal')
  .controller('GroupUserListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User','$$UserGroup', '$$Permission', '$q', '$uibModal', function($scope, $rootScope, $state, AppUtils, $$User, $$UserGroup, $$Permission, $q, $uibModal) {
    
    $scope.userList = [];
    $scope.userListForDisplay = [];
    $scope.userGroup;

    $scope.init = function(){
        var userGroupID = $state.params['userGroupID'];
        var request = {
            userGroupID: userGroupID,
            includeUserData: '1'
        };

        $scope.userGroup = $$UserGroup.get({}, request, function(group){
            $scope.userList = group.users;
        });
    };

    $scope.myMenu = {
        itemList:[
            {
                text: '查看详情',
                callback: function(user) {
                    $scope.navigateTo($scope.navMapping.GROUP_USER_INFO,{userID: user.userID,userGroupID: $state.params['userGroupID']});
                }
            },
            {
                text:'编辑',
                callback: function (user) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/components/portal/UserManager/User/UserList/EditUser.template.html',
                        controller: 'UserListController.EditUser',
                        size: 'md',
                        resolve: {
                          user: function () {
                            return user;
                          }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        console.log(user);
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                }
            },{
                text:'删除',
                callback: function (user) {
                    console.log('Delete user');
                    console.log(user);
                }
            }
        ],
        setting:{

        }
    };
  }]);
