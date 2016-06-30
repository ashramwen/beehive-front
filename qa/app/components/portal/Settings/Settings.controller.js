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
            AppUtils.alert('新密码与输入的确认密码不一致，请重新输入！');
            return;
        }

        $$User.changePassword(password, function(){
            AppUtils.alert('更改密码成功！');
        }, function(){
            AppUtils.alert('更改密码失败！');
        });
    };
  }]);
