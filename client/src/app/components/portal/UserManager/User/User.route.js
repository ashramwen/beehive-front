'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.UserManager.User.SearchUser', {
        url: '/SearchUser',
        templateUrl: 'app/components/portal/UserManager/User/SearchUser/SearchUser.html',
        controller: 'SearchUserController',
        stateName: '查询业主',
        previous: 'app.portal.UserManager.User.UserList'
      })
      .state('app.portal.UserManager.User.NewUser', {
        url: '/NewUser',
        templateUrl: 'app/components/portal/UserManager/User/NewUser/NewUser.html',
        controller: 'NewUserController',
        stateName: '新建业主',
        previous: 'app.portal.UserManager.User.UserList'
      })
      .state('app.portal.UserManager.User.UserList', {
        url: '/UserList',
        templateUrl: 'app/components/portal/UserManager/User/UserList/UserList.html',
        controller: 'UserListController',
        stateName: '业主列表',
        previous: 'app.portal.UserManager'
      })
      .state('app.portal.UserManager.User.UserInfo', {
        url: '/:userID/UserInfo',
        templateUrl: 'app/components/portal/UserManager/User/UserInfo/UserInfo.html',
        controller: 'UserInfoController',
        stateName: '业主详情',
        previous: 'app.portal.UserManager.User.UserList'
      })
      .state('app.portal.UserManager.User.UserThingAuthority', {
        url: '/:userID/ThingAuthority',
        templateUrl: 'app/components/portal/UserManager/User/UserThingAuthority/UserThingAuthority.html',
        controller: 'UserThingAuthorityController',
        stateName: '设备所有权',
        previous: 'app.portal.UserManager.User.UserInfo'
      })
      .state('app.portal.UserManager.User.UserThingACL', {
        url: '/:userID/ThingACL',
        templateUrl: 'app/components/portal/UserManager/User/UserThingACL/UserThingACL.html',
        controller: 'UserThingACLController',
        stateName: '设备控制权',
        previous: 'app.portal.UserManager.User.UserInfo'
      });
  });
