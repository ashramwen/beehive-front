'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.UserManager.UserGroup.UserGroupList', {
        url: '/UserGroupList',
        templateUrl: 'app/components/portal/UserManager/UserGroup/UserGroupList/UserGroupList.html',
        controller: 'UserGroupListController',
        stateName: 'userManager.groupList',
        previous: 'app.portal.UserManager'
      })
      .state('app.portal.UserManager.UserGroup.UserGroupEdit', {
        url: '/UserGroupList/:userGroupID/edit',
        templateUrl: 'app/components/portal/UserManager/UserGroup/GroupEditor/GroupEditor.html',
        controller: 'GroupEditorController',
        stateName: 'userManager.editGroup',
        previous: 'app.portal.UserManager.UserGroup.UserGroupList'
      })
      .state('app.portal.UserManager.UserGroup.GroupUserList', {
        url: '/GroupUser/:userGroupID/UserList',
        templateUrl: 'app/components/portal/UserManager/UserGroup/GroupUserList/GroupUserList.html',
        controller: 'GroupUserListController',
        stateName: 'userManager.userList',
        previous: 'app.portal.UserManager.UserGroup.UserGroupList'
      })
      .state('app.portal.UserManager.UserGroup.UserInfo', {
        url: '/:userGroupID/UserInfo/:userID',
        templateUrl: 'app/components/portal/UserManager/User/UserInfo/UserInfo.html',
        controller: 'UserInfoController',
        stateName: 'userManager.userDetail',
        previous: 'app.portal.UserManager.UserGroup.GroupUserList'
      });
  });
