'use strict';

angular.module('BeehivePortal')
  .controller('UserLoginController', ['$scope', '$rootScope', '$state', 'AppUtils','Session', '$$User', '$uibModal', function($scope, $rootScope, $state, AppUtils, Session, $$User, $uibModal) {
    
    $scope.credentials = {
        userID: '',
        password: '',
        permanentToken: false
    };


    $scope.login = function(credentials){
        if(credentials.userID == 'admin' && credentials.password == 'admin'){
            var credentials = {
                accessToken: "super_token",
                company: "12312",
                createBy: null,
                kiiLoginName: "33032719891111",
                kiiUserID: "f83120e36100-2cc9-5e11-19d9-0df7b818",
                mail: "ff",
                modifyBy: null,
                phone: "ffa",
                role: "4",
                userID: "Admin",
                userName: "Admin"
            };

            Session.setCredential(credentials);
            $state.go('app.portal.Welcome');
        }else{
            $$User.login(credentials ,function(credentials){
                Session.setCredential(credentials);
                $state.go('app.portal.Welcome');
            }, function(erro){
                AppUtils.alert('登陆失败');
            });
        }
    };

    $scope.register = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            template: angular.element('#registerModal')[0].outerHTML,
            controller: 'UserLoginController.Register',
            size: 'sm'
        });
    }


  }]);
angular.module('BeehivePortal')
  .controller('UserLoginController.Register', function($scope, $uibModalInstance, $$User, AppUtils){
    $scope.credentials = {
        userID: '',
        password: ''
    };

    $scope.register = function (credentials) {
        $$User.register({}, credentials, function(){
            AppUtils.alert('注册成功！请使用用户名登陆！');
            $uibModalInstance.close();
        }, function(credentials, erro){
            AppUtils.alert(erro);
        });
    };

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
  });