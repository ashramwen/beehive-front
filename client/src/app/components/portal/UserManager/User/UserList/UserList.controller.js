'use strict';

angular.module('BeehivePortal')
    .controller('UserListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$uibModal', '$log', '$location', '$$UserManager', function($scope, $rootScope, $state, AppUtils, $uibModal, $log, $location, $$UserManager) {
        /*
         * userList caches data of different pages,
         * while userListForDisplay caches only one-page data
         */
        $scope.userList = [];
        $scope.userListForDisplay = [];

        /*
         * search options and filed
         */
        $scope.searchValue = "";
        $scope.queryOptions = [{
            text: "user.loginName",
            value: "userName"
        }, {
            text: "user.userName",
            value: "displayName"
        }];
        $scope.queryFiled = _.clone($scope.queryOptions[0]);

        $scope.myMenu = {
            itemList: [{
                text: 'controls.view',
                callback: function(user) {
                    $scope.navigateTo($scope.navMapping.USER_INFO, {
                        userID: user.userID
                    });
                }
            }, {
                text: 'controls.edit',
                callback: function(user) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/components/portal/UserManager/User/EditUser.template.html',
                        controller: 'UserController.EditUser',
                        size: 'md',
                        resolve: {
                            user: function() {
                                return user;
                            }
                        }
                    });

                    modalInstance.result.then(function(updatedUser) {
                        _.extend(user, updatedUser);
                    }, function() {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                }
            }, {
                text: 'controls.delete',
                callback: function(user) {
                    $$UserManager.remove({}, user, function() {
                        $scope.userList.remove(user);
                        findUsersForDisplay();
                    }, function() {
                    });
                }
            }],
            setting: {

            }
        };

        /*
         * search users by option
         */
        $scope.queryUsers = function(queryFiled, value) {

            var request = {};
            if (value) request[queryFiled] = value;

            $$UserManager.query(request, function(userList) {
                console.log(userList);
                $scope.userList = userList;
            }, function() {
                AppUtils.alert({msg: 'Failed to load group user list!'});
            });
        };

        $scope.init = function() {
            console.log('root', $rootScope.credential);
            if ($rootScope.credential.roleName == 'commUser') {
                $state.go('app.portal.UserManager.UserGroup.UserGroupList');
            }
            $rootScope.$watch('login', function(newVal) {
                if (!newVal) return;
                /*
                 * page settings
                 */
                $location.search({
                    'pageIndex': 1
                });
                $scope.currentIndex = 1;

                $scope.queryUsers();
            });

        };

        $scope.$watch('login', function(val){
            if(!val)return;
            $scope.init();
        });

        function findUsersForDisplay() {
            $scope.userListForDisplay = _.filter($scope.userList, function(user, index) {
                return index >= ($scope.currentIndex - 1) * $scope.listMaxLength &&
                    index < $scope.currentIndex * $scope.listMaxLength;
            });
        }
    }]);
