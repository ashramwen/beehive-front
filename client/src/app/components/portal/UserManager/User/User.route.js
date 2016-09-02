'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.UserManager.User.SearchUser', {
        url: '/SearchUser',
        templateUrl: 'app/components/portal/UserManager/User/SearchUser/SearchUser.html',
        controller: 'SearchUserController',
        stateName: 'userManager.userList',
        previous: 'app.portal.UserManager.User.UserList'
      })
      .state('app.portal.UserManager.User.NewUser', {
        url: '/NewUser',
        templateUrl: 'app/components/portal/UserManager/User/NewUser/NewUser.html',
        controller: 'NewUserController',
        stateName: 'userManager.newUser',
        previous: 'app.portal.UserManager.User.UserList'
      })
      .state('app.portal.UserManager.User.UserList', {
        url: '/UserList',
        templateUrl: 'app/components/portal/UserManager/User/UserList/UserList.html',
        controller: 'UserListController',
        stateName: 'userManager.userList',
        previous: 'app.portal.UserManager'
      })
      .state('app.portal.UserManager.User.UserInfo', {
        url: '/:userID/UserInfo',
        templateUrl: 'app/components/portal/UserManager/User/UserInfo/UserInfo.html',
        controller: 'UserInfoController',
        stateName: 'userManager.userDetail',
        previous: 'app.portal.UserManager.User.UserList'
      });
  });
