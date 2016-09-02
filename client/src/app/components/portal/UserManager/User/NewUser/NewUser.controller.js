'use strict';

angular.module('BeehivePortal')
    .controller('NewUserController', ['$scope', 'AppUtils', '$$UserManager', function($scope, AppUtils, $$UserManager) {
        

        $scope.ruleOptions = [{
            value: 'commUser',
            text: 'user.roles.commUser'
        }, {
            value: 'userAdmin',
            text: 'user.roles.userAdmin'
        }, {
            value: 'administrator',
            text: 'user.roles.administrator'
        }];

        /*
         * user object for registration.
         */
        $scope.newUser = {
            userName: '', // required
            phone: '',
            mail: '',
            role: '4', // required
            roleName: ''
        };

        /*
         * create user
         */
        $scope.createUser = function() {
            $$UserManager.create($scope.newUser, function(userRegistrationInfo) {
                var userID = userRegistrationInfo.userID;
                var activityToken = userRegistrationInfo.activityToken;

                AppUtils.alert({
                    msg: 'userManager.createUserAlertMsg',
                    data: {userID: userID, activityToken: activityToken}
                });

                $scope.navigateTo($scope.navMapping.USER_LIST);
            }, function(response) {
                AppUtils.alert({
                    msg: 'userManager.userNameConflictMsg'
                });
            });
        }
    }]);
