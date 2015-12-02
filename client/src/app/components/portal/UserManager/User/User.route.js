'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.UserManager.User.SearchUser', {
        url: '/SearchUser',
        templateUrl: 'app/components/portal/UserManager/User/SearchUser/SearchUser.html',
        controller: 'SearchUserController',
      })
      .state('app.portal.UserManager.User.NewUser', {
        url: '/NewUser',
        templateUrl: 'app/components/portal/UserManager/User/NewUser/NewUser.html',
        controller: 'NewUserController',
      })
      .state('app.portal.UserManager.User.UserList', {
        url: '/UserList',
        templateUrl: 'app/components/portal/UserManager/User/UserList/UserList.html',
        controller: 'UserListController',
      })
      .state('app.portal.UserManager.User.UserInfo', {
        url: '/UserInfo?id',
        templateUrl: 'app/components/portal/UserManager/User/UserInfo/UserInfo.html',
        controller: 'UserInfoController',
      })
      .state('app.portal.UserManager.User.UserThingAuthority', {
        url: '/:id/ThingAuthority',
        templateUrl: 'app/components/portal/UserManager/ThingAuthority/ThingAuthority.html',
        controller: 'ThingAuthorityController'
      });
  });
