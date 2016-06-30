'use strict';

angular.module('BeehivePortal')
  .controller('AppController', ['$scope', '$rootScope', '$state', 'AppUtils', 'Session', 'AUTH_EVENTS', function($scope, $rootScope, $state, AppUtils, Session, AUTH_EVENTS) {
    
    Session.useCredential().then(function(){
        $rootScope.login = true;
        $rootScope.$broadcast('tokenReady', true);
    }, function(error){
        if(error == AUTH_EVENTS.tokenNotGiven){
            $state.go('app.secure.UserLogin');
        }else{
            AppUtils.alert('用户登录口令过期，请重新登陆！', '用户登录过期', function(){
                AppUtils.clearSession();
                if(error.status == -1){

                }
                $state.go('app.secure.UserLogin');
            });
        }
    });

    $scope.thirdPartyAPIUrl = window.thirdPartyAPIUrl;
  }]);
