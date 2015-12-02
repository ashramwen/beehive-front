'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.UserManager.User', {
        url: '/User',
        templateUrl: 'app/components/portal/UserManager/User/User.html',
        controller: 'UserController',
        abstract: true,
      })
      .state('app.portal.UserManager.UserGroup', {
        url: '/UserGroup',
        templateUrl: 'app/components/portal/UserManager/UserGroup/UserGroup.html',
        controller: 'UserGroupController',
        abstract: true,
      });
  });
