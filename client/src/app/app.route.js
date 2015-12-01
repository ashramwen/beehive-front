'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app',{
        url: '',
        templateUrl: 'app/app.html',
        controller: 'AppController'
      })
      .state('app.portal', {
        url: '/portal',
        templateUrl: 'app/components/portal/portal.html',
        controller: 'PortalController',
      })
      .state('app.secure', {
        url: '/secure',
        templateUrl: 'app/components/secure/secure.html',
        controller: 'SecureController'
      });

      $urlRouterProvider.otherwise('/secure/UserLogin');
  });
