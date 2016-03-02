'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.ThingManager.LocationView', {
        url: '/LocationView',
        templateUrl: 'app/components/portal/ThingManager/LocationView/LocationView.html',
        controller: 'LocationViewController',
        previous: 'app.portal.ThingManager',
        stateName: '位置视图'
      })
      .state('app.portal.ThingManager.TypeView', {
        url: '/TypeView',
        templateUrl: 'app/components/portal/ThingManager/TypeView/TypeView.html',
        controller: 'TypeViewController',
        previous: 'app.portal.ThingManager',
        stateName: '种类视图'
      })
      .state('app.portal.ThingManager.TagView', {
        url: '/TagView',
        templateUrl: 'app/components/portal/ThingManager/TagView/TagView.html',
        controller: 'TagViewController',
        previous: 'app.portal.ThingManager',
        stateName: '标签视图'
      })
      .state('app.portal.ThingManager.LocationThingDetail', {
        url: '/LocationView/ThingDetail/:thingid?from',
        templateUrl: 'app/components/portal/ThingManager/ThingDetail/ThingDetail.html',
        controller: 'ThingDetailController',
        previous: 'app.portal.ThingManager.LocationView',
        stateName: '设备详情'
      })
      .state('app.portal.ThingManager.TypeThingDetail', {
        url: '/TypeView/ThingList/:typeName/ThingDetail/:thingid?from',
        templateUrl: 'app/components/portal/ThingManager/ThingDetail/ThingDetail.html',
        controller: 'ThingDetailController',
        previous: 'app.portal.ThingManager.TypeThingList',
        stateName: '设备详情'
      })
      .state('app.portal.ThingManager.TypeThingList', {
        url: '/TypeView/ThingList/:typeName?from',
        templateUrl: 'app/components/portal/ThingManager/ThingList/ThingList.html',
        controller: 'ThingListController',
        previous: 'app.portal.ThingManager.TypeView',
        stateName: '设备列表'
      })
      .state('app.portal.ThingManager.TagThingDetail', {
        url: '/TagView/TagThingList/:displayName/ThingDetail/:thingid?from',
        templateUrl: 'app/components/portal/ThingManager/ThingDetail/ThingDetail.html',
        controller: 'ThingDetailController',
        previous: 'app.portal.ThingManager.TagThingList',
        stateName: '设备详情'
      })
      .state('app.portal.ThingManager.TagThingList', {
        url: '/TagView/ThingList/:displayName/?type&from',
        templateUrl: 'app/components/portal/ThingManager/ThingList/ThingList.html',
        controller: 'ThingListController',
        previous: 'app.portal.ThingManager.TagView',
        stateName: '设备列表'
      })
      .state('app.portal.ThingManager.LocationThingACL', {
        url: '/LocationView/ThingDetail/:thingid/acl?from',
        templateUrl: 'app/components/portal/ThingManager/ThingACL/ThingACL.html',
        controller: 'ThingACLController',
        previous: 'app.portal.ThingManager.LocationThingDetail',
        stateName: '设备使用权限'
      });
  });
