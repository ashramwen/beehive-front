'use strict';

angular.module('BeehivePortal')
    .controller('GroupUserListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', '$$UserGroup', '$$Permission', '$q', '$uibModal', function($scope, $rootScope, $state, AppUtils, $$User, $$UserGroup, $$Permission, $q, $uibModal) {

        $scope.userList = [];
        $scope.userListForDisplay = [];
        $scope.userGroup;

        $scope.searchValue = "";
        $scope.queryOptions = [{
            text: "user.loginName",
            value: "userName"
        }, {
            text: "user.userName",
            value: "displayName"
        }];

        /*
         * search users by option
         */
        $scope.queryUsers = function(queryField, value) {
            $scope.filters = {};
            $scope.filters[queryField] = value;
            console.log('filters', $scope.filters);
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
                    $scope.userList = _.map(group.users, function(user){
                        user.displayName = user.displayName || '';
                        return user;
                    });

                });
            });
        };

        $scope.myMenu = {
            itemList: [
                {
                    text: 'controls.view',
                    callback: function(user) {
                        $scope.navigateTo($scope.navMapping.GROUP_USER_INFO, {
                            userID: user.userID,
                            userGroupID: $state.params['userGroupID']
                        });
                    }
                }
            ],
            setting: {

            }
        };
    }]);
