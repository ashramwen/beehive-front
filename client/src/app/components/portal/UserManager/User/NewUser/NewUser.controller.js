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
            $scope.submitted = true;
            if(!$scope.newUserForm.displayName.$valid || !$scope.newUserForm.loginName.$valid || !$scope.newUserForm.mail.$valid ){
                return;
            }else if(!$scope.newUser.phone && !$scope.newUser.mail && !$scope.newUser.userName){
                return;
            }

            $$UserManager.create($scope.newUser, function(userRegistrationInfo) {
                var userID = userRegistrationInfo.userID;
                var activityToken = userRegistrationInfo.activityToken;

                AppUtils.alert({
                    msg: 'userManager.createUserAlertMsg',
                    data: {userID: userID, activityToken: activityToken}
                });

                $scope.navigateTo($scope.navMapping.USER_LIST);
            }, function(response) {
                if(response.statusText == 'Conflict'){
                    AppUtils.alert({
                        msg: 'userManager.userNameConflictMsg'
                    });
                }else{
                    switch(response.errorCode){
                        case 'REQUIRED_FIELDS_MISSING':
                            break;
                        case 'USER_EXIST':
                            AppUtils.alert({
                                msg: 'userManager.userNameConflictMsg'
                            });
                            break;
                    }
                }
            });
        }
    }]);
