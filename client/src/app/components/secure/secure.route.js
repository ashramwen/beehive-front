'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.secure.UserLogin', {
        url: '/UserLogin',
        templateUrl: 'app/components/secure/UserLogin/UserLogin.html',
        controller: 'UserLoginController',
      });
  });
