'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.UserManager.UserGroup.UserGroupList', {
        url: '/UserGroupList',
        templateUrl: 'app/components/portal/UserManager/UserGroup/UserGroupList/UserGroupList.html',
        controller: 'UserGroupListController',
      })
      .state('app.portal.UserManager.UserGroup.GroupUser', {
        url: '/GroupUser',
        templateUrl: 'app/components/portal/UserManager/UserGroup/GroupUser/GroupUser.html',
        controller: 'GroupUserController',
      });
  });
