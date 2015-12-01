'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.UserManager', {
        url: '/UserManager',
        templateUrl: 'app/components/portal/UserManager/UserManager.html',
        controller: 'UserManagerController',
      })
      .state('app.portal.ThingManager', {
        url: '/ThingManager',
        templateUrl: 'app/components/portal/ThingManager/ThingManager.html',
        controller: 'ThingManagerController',
      });
  });
