'use strict';

angular.module('BeehivePortal')
    .controller('GroupUserListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', '$$UserGroup', '$$Permission', '$q', '$uibModal', function($scope, $rootScope, $state, AppUtils, $$User, $$UserGroup, $$Permission, $q, $uibModal) {

        $scope.userList = [];
        $scope.userListForDisplay = [];
        $scope.userGroup;

        $scope.searchValue = "";
        $scope.queryOptions = [{
            text: "用户ID",
            value: "userID"
        }, {
            text: "用户名",
            value: "userName"
        }];

        /*
         * search users by option
         */
        $scope.queryUsers = function(queryField, value) {
            $scope.filters = {};
            $scope.filters[queryField] = value;
            console.log('filters', $scope.filters);
            // var request = {};
            // if (value) request[queryField] = value;
            // $$UserManager.query(request, function(userList) {
            //     console.log(userList);
            //     $scope.userList = userList;
            // }, function() {
            //     AppUtils.alert('Failed to load group user list!');
            // });

        };

        $scope.init = function() {

            $rootScope.$watch('login', function(newVal) {
                if (!newVal) return;
                var userGroupID = $state.params['userGroupID'];
                var request = {
                    userGroupID: userGroupID,
                    includeUserData: '1'
                };

                $scope.userGroup = $$UserGroup.get({}, request, function(group) {
                    $scope.userList = group.users;
                });
            });
        };

        $scope.myMenu = {
            itemList: [{
                    text: '查看详情',
                    callback: function(user) {
                        $scope.navigateTo($scope.navMapping.GROUP_USER_INFO, {
                            userID: user.userID,
                            userGroupID: $state.params['userGroupID']
                        });
                    }
                },
                // {
                //     text: '编辑',
                //     callback: function(user) {
                //         var modalInstance = $uibModal.open({
                //             animation: true,
                //             templateUrl: 'app/components/portal/UserManager/User/UserList/EditUser.template.html',
                //             controller: 'UserListController.EditUser',
                //             size: 'md',
                //             resolve: {
                //                 user: function() {
                //                     return user;
                //                 }
                //             }
                //         });
                //
                //         modalInstance.result.then(function(selectedItem) {
                //             console.log(user);
                //         }, function() {
                //             $log.info('Modal dismissed at: ' + new Date());
                //         });
                //     }
                // },
                {
                    text: '删除',
                    callback: function(user) {
                        AppUtils.confirm('提示信息', '确认要将该用户移出吗？', function() {
                            $$UserGroup.deleteUser({
                                userID: user.userID,
                                userGroupID: $scope.userGroup.userGroupID
                            });
                        });
                    }
                }
            ],
            setting: {

            }
        };
    }]);
