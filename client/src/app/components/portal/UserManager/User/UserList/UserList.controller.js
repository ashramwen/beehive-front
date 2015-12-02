'use strict';

angular.module('BeehivePortal')
  .controller('UserListController', ['$scope', '$rootScope', '$state', 'AppUtils', 'UserService', '$uibModal', '$log', '$location',function($scope, $rootScope, $state, AppUtils, UserService, $uibModal, $log, $location) {
    /*
     * userList caches data of different pages,
     * while userListForDisplay caches only one-page data
     */
    $scope.userList = [];
    $scope.userListForDisplay = [];

    /*
     * page settings
     */
    $location.search({'pageIndex': 1});
    $scope.currentIndex = 1;

    $scope.pageChanged = function(){
        $location.search({'pageIndex': $scope.currentIndex});
    }

    $scope.init = function(){
        UserService.getUserList().then(function(response){
            // get user list successfully
            $scope.userList = response.data;
            $scope.userListForDisplay = response.data;
            console.log(response);
        },function(response){
            // failed to get user list
            console.log(response);
        });
    }

    $scope.myMenu = {
        itemList:[
            {
                text: '查看详情',
                callback: function(user) {
                    $scope.navigateTo($scope.otherNavs.USER_INFO,{id: user.id});
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

angular.module('BeehivePortal')
  .controller('UserListController.EditUser',function ($scope, $uibModalInstance, user) {
    $scope.user = user;
    $scope.ok = function () {
        $uibModalInstance.close($scope.user);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  });
