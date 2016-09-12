'use strict';

angular.module('BeehivePortal')
  .controller('UserLoginController', ['$scope', '$rootScope', '$state', 'AppUtils','Session', '$$Auth', '$uibModal', function($scope, $rootScope, $state, AppUtils, Session, $$Auth, $uibModal) {
    
    $scope.credentials = {
        userName: '',
        password: '',
        permanentToken: false
    };


    $scope.login = function(credentials){
        /*
        if(credentials.userName == 'admin' && credentials.password == 'admin'){
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
                userID: "211102",
                userName: "Admin"
            };

            Session.setCredential(credentials);
            $state.go('app.portal.Welcome');
            $rootScope.login = true;
        }else{
            */
        $$Auth.login(credentials ,function(credentials){
            Session.setCredential(credentials);
            $state.go('app.portal.Welcome');
            $rootScope.login = true;
        }, function(erro){
            AppUtils.alert({msg: 'user.loginFailedMsg'});
        });
        //}
    };

    $scope.register = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'registerModal',
            controller: 'UserLoginController.Register',
            size: 'sm'
        });
    }


  }]);
angular.module('BeehivePortal')
  .controller('UserLoginController.Register', ['$scope', '$uibModalInstance', '$$Auth', 'AppUtils', '$http', '$translate', 
    function($scope, $uibModalInstance, $$Auth, AppUtils, $http, $translate){

    $scope.currentStep = 1;

    $scope.credentials = {
        userName: '',
        newPassword: '',
        initPwdToken: ''
    };

    $scope.register = function (credentials) {
        
        switch($scope.currentStep){
            case 1:
                $scope.registerSubmitted = true;
                if($scope.registerForm.userName.$invalid || $scope.registerForm.token.$invalid) return;

                $$Auth.activate({}, credentials, function(response){
                    $scope.credentials.initPwdToken = response.initPwdToken;
                    $scope.currentStep = 2;
                    $scope.tokenInvalid = false;
                    $scope.userNameNotFound = false;
                }, function(response){
                    switch(response.statusText){
                        case 'Unauthorized':
                            $scope.tokenInvalid = true;
                            break;
                        case "Not Found":
                            $scope.userNameNotFound = true;
                            break;
                    }
                });
                break;
            case 2:
                $scope.passwordSubmitted = true;
                if(credentials.confirm != credentials.newPassword || $scope.registerForm.password.$invalid) return;
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + $scope.credentials['initPwdToken'];
                $$Auth.initpassword({}, credentials, function(){
                    $scope.currentStep = 3;
                }, function(error){
                    if(error.data.errorCode == "INVALID_PASSWORD"){
                        $scope.invalidPassword;
                    }
                });
                break;
            case 3: 
                $uibModalInstance.dismiss();
                break;
        }
    };

    $scope.$watch('currentStep', function(value){
        if(value < 3){
            $translate('controls.submit').then(function(val){
                $scope.btnText = val;
            });
        }else{
            $translate('controls.finish').then(function(val){
                $scope.btnText = val;
            });
        }
    });

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };

    $scope.initPassword = function(){
        $uibModalInstance.dismiss('cancel');
    };
  }]);