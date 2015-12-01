'use strict';

angular.module('BeehivePortal')
  .controller('UserLoginController', ['$scope', '$rootScope', '$state', 'AppUtils','UserLoginService','Session',function($scope, $rootScope, $state, AppUtils, UserLoginService, Session) {
    
    $scope.login = function(credentials){
        UserLoginService.login(credentials).then(function(response){
            Session.setUser(response.data.user);
            $state.go('app.portal.UserManager.User.UserList');
            console.log(response);
        },function(response){
            console.log(response);
        });

    };


  }]);
