'use strict';

angular.module('BeehivePortal')
    .controller('UserGroupListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$uibModal', '$$UserGroup', '$location', '$http', function($scope, $rootScope, $state, AppUtils, $uibModal, $$UserGroup, $location, $http) {

        $scope.dataset = {};
        $scope.dataset.userGroups = [];
        $scope.dataset.userGroupsForDisplay = [];

        $scope.init = function() {
            $scope.$watch('login', function(newVal) {
                if (!newVal) return;
                $scope.groupType = $scope.groupTypes[0];
                $scope.groupTypes.splice(1, 1);

                $scope.$watch('groupType', function(newVal, oldVal) {
                    if ($scope.groupType.value == 'mygroup') {
                        $scope.dataset.userGroups = $$UserGroup.getMyGroups();
                    } else {
                        $scope.dataset.userGroups = $$UserGroup.getList();
                    }
                });
            });
        };


        /**
         * group type options and field
         */
        $scope.groupTypes = [{
            text: 'userManager.groupTypes.myGroups',
            value: 'mygroup'
        }, {
            text: 'userManager.groupTypes.allGroups',
            value: 'allgroup'
        }];
        $scope.groupType = null;

        /*
         * search options and filed
         */
        $scope.searchValue = "";
        $scope.queryOptions = [{
            text: "userManager.groupName",
            value: "userGroupName"
        }];

        /*
         * search group by option
         */
        $scope.queryUserGroups = function(queryField, value) {
            $scope.filters = {};
            $scope.filters[queryField] = value;
            // var request = {};
            // if (value) {
            //     request[queryField] = value;
            //     request.includeUserData = '0';
            //     console.log('request', request);
            //     $scope.dataset.userGroups = $$UserGroup.query({}, request);
            // } else {
            //     if ($rootScope.credential.roleName == 'commUser') {
            //         $scope.dataset.userGroups = $$UserGroup.getMyGroups();
            //     } else {
            //         $scope.dataset.userGroups = $$UserGroup.getList();
            //     }
            // }
        }


        /*
         * pop up new user group modal
         */
        $scope.createGroup = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/portal/UserManager/UserGroup/UserGroupList/NewUserGroup.template.html',
                controller: 'UserGroupListController.NewUserGroup',
                size: 'md',
                resolve: {}
            });

            modalInstance.result.then(function(newGroup) {
                console.log(newGroup);
                $scope.dataset.userGroups.push(newGroup);
            }, function() {

            });
        }

        $scope.goUserList = function(group) {
            console.log(group);
            $scope.navigateTo($scope.navMapping.GROUP_USER_LIST, {
                userGroupID: group.userGroupID
            });
        };

        $scope.goThingAuth = function(group) {
            $scope.navigateTo($scope.navMapping.GROUP_THING_AUTH, {
                userGroupID: group.userGroupID
            });
        };

        $scope.goEdit = function(group) {
            $scope.navigateTo($scope.navMapping.USER_GROUP_EDITOR, {
                userGroupID: group.userGroupID
            });
        };

        $scope.deleteGroup = function(group) {
            var options = {
                msg: 'userManager.deleteUserGroupMsg',
                callback: function() {
                    $$UserGroup.remove({}, group, function() {
                        $scope.dataset.userGroups = _.reject($scope.dataset.userGroups, function(userGroup) {
                            return userGroup == group;
                        });
                    });
                },
                data: {
                    userGroupName: group.userGroupName
                }
            };

            AppUtils.confirm(options);
        };
    }]);


angular.module('BeehivePortal')
    .controller('UserGroupListController.NewUserGroup', function($scope, $uibModalInstance, $$UserGroup, AppUtils) {

        $scope.newGroup = {
            userGroupName: "",
            description: ""
        };

        $scope.ok = function() {
            $$UserGroup.create({}, $scope.newGroup, function(response) {
                $scope.newGroup.userGroupID = response.userGroupID;
                $scope.newGroup.createDate = (new Date()).getTime();
                $scope.newGroup.createBy = $scope.credential.id;
                $uibModalInstance.close($scope.newGroup);
            }, function(response) {
                AppUtils.alert({msg: 'userManager.createNewGroupFailedMsg'})
            })
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
