'use strict';

angular.module('BeehivePortal')
  .controller('SettingsController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', '$http',function($scope, $rootScope, $state, AppUtils, $$User, $http) {
    $scope.password = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    $scope.changePassword = function(password){
        if(password.newPassword != password.confirmPassword){
            AppUtils.alert({msg: 'settings.passwordNotMatch'});
            return;
        }

        $$User.changePassword(password, function(){
            AppUtils.alert({msg: 'settings.changePasswordSuccessMsg'});
        }, function(){
            AppUtils.alert({msg: 'settings.changePasswordErrorMsg'});
        });
    };
  }]);
