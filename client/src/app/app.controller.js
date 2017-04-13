'use strict';

angular.module('BeehivePortal')
  .controller('AppController', ['$scope', '$rootScope', '$state', 'AppUtils', 'Session', 'AUTH_EVENTS', '$translate', 'AppService', function($scope, $rootScope, $state, AppUtils, Session, AUTH_EVENTS, $translate, AppService) {
    
    Session.useCredential().then(function(){
        $rootScope.login = true;
        $rootScope.$broadcast('tokenReady', true);
    }, function(error){
        if(error == AUTH_EVENTS.tokenNotGiven){
            $state.go('app.secure.UserLogin');
        }else{
            AppUtils.alert({
                msg: 'app.SESSION_TIMEOUT',
                callback: function(){
                    AppUtils.clearSession();
                    $state.go('app.secure.UserLogin');
                }
            });
        }
    });

    $scope.$watch('login', function(flag, oldVal){
        if(!oldVal && flag){
            AppService.lazyLoad();
        }
    });

    $translate.use($state.params['lan']);

    $scope.thirdPartyAPIUrl = window.thirdPartyAPIUrl;
  }]);
