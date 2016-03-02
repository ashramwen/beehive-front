'use strict';

angular.module('BeehivePortal')
  .controller('SettingsController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', '$http',function($scope, $rootScope, $state, AppUtils, $$User, $http) {
    $scope.password = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    $scope.changePassword = function(password){
        var ajaxSettings = {
            method: 'POST',
            url: MyAPIs.OPERATOR + '/changepassword',
            data: password,
            headers: {
                'accessToken': 'Bearer ' + MyApp.credential.accessToken
            }
        };

        if(password.newPassword != password.confirmPassword){
            AppUtils.alert('新密码与输入的确认密码不一致，请重新输入！');
            return;
        }

        $http(ajaxSettings).then(function(){
            AppUtils.alert('更改密码成功！');
        }, function(){
            AppUtils.alert('更改密码失败！');
        });
    }
  }]);
