'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.secure.AdminLogin', {
        url: '/AdminLogin',
        templateUrl: 'app/components/secure/AdminLogin/AdminLogin.html',
        controller: 'AdminLoginController',
      })
      .state('app.secure.UserLogin', {
        url: '/UserLogin',
        templateUrl: 'app/components/secure/UserLogin/UserLogin.html',
        controller: 'UserLoginController',
      });
  });
