'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.UserManager.UserGroup.UserGroupList', {
        url: '/UserGroupList',
        templateUrl: 'app/components/portal/UserManager/UserGroup/UserGroupList/UserGroupList.html',
        controller: 'UserGroupListController',
        stateName: '群组列表',
        previous: 'app.portal.UserManager'
      })
      .state('app.portal.UserManager.UserGroup.UserGroupEdit', {
        url: '/UserGroupList/:userGroupID/edit',
        templateUrl: 'app/components/portal/UserManager/UserGroup/GroupEditor/GroupEditor.html',
        controller: 'GroupEditorController',
        stateName: '编辑群组',
        previous: 'app.portal.UserManager.UserGroup.UserGroupList'
      })
      .state('app.portal.UserManager.UserGroup.GroupUserList', {
        url: '/GroupUser/:userGroupID/UserList',
        templateUrl: 'app/components/portal/UserManager/UserGroup/GroupUserList/GroupUserList.html',
        controller: 'GroupUserListController',
        stateName: '业主列表',
        previous: 'app.portal.UserManager.UserGroup.UserGroupList'
      })
      .state('app.portal.UserManager.UserGroup.UserInfo', {
        url: '/:userGroupID/UserInfo/:userID',
        templateUrl: 'app/components/portal/UserManager/User/UserInfo/UserInfo.html',
        controller: 'UserInfoController',
        stateName: '用户列表',
        previous: 'app.portal.UserManager.UserGroup.GroupUserList'
      })
      .state('app.portal.UserManager.UserGroup.GroupThingAuthority', {
        url: '/:userGroupID/ThingAuthority',
        templateUrl: 'app/components/portal/UserManager/UserGroup/GroupThingAuthority/GroupThingAuthority.html',
        controller: 'UserThingAuthorityController',
        stateName: '设备所有权',
        previous: 'app.portal.UserManager.UserGroup.UserGroupEdit'
      })
      .state('app.portal.UserManager.UserGroup.GroupThingACL', {
        url: '/:userGroupID/ThingACL',
        templateUrl: 'app/components/portal/UserManager/UserGroup/GroupThingACL/GroupThingACL.html',
        controller: 'GroupThingACLController',
        stateName: '设备控制权',
        previous: 'app.portal.UserManager.UserGroup.UserGroupEdit'
      })
      .state('app.portal.UserManager.UserGroup.GroupUserThingAuthority', {
        url: '/:userGroupID/ThingAuthority',
        templateUrl: 'app/components/portal/UserManager/UserGroup/GroupThingAuthority/GroupThingAuthority.html',
        controller: 'UserThingAuthorityController',
        stateName: '设备所有权',
        previous: 'app.portal.UserManager.UserGroup.UserInfo'
      })
      .state('app.portal.UserManager.UserGroup.GroupUserThingACL', {
        url: '/:userGroupID/ThingACL',
        templateUrl: 'app/components/portal/UserManager/UserGroup/GroupThingACL/GroupThingACL.html',
        controller: 'GroupThingACLController',
        stateName: '设备控制权',
        previous: 'app.portal.UserManager.UserGroup.UserInfo'
      });
  });
