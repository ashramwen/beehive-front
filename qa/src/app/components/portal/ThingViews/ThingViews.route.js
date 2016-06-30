'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.ThingViews.LocationView', {
        url: '/LocationView',
        templateUrl: 'app/components/portal/ThingViews/LocationView/LocationView.html',
        controller: 'LocationViewController',
        previous: 'app.portal.ThingViews',
        stateName: '位置视图'
      })
      .state('app.portal.ThingViews.TypeView', {
        url: '/TypeView',
        templateUrl: 'app/components/portal/ThingViews/TypeView/TypeView.html',
        controller: 'TypeViewController',
        previous: 'app.portal.ThingViews',
        stateName: '种类视图'
      })
      .state('app.portal.ThingViews.TagView', {
        url: '/TagView',
        templateUrl: 'app/components/portal/ThingViews/TagView/TagView.html',
        controller: 'TagViewController',
        previous: 'app.portal.ThingViews',
        stateName: '标签视图'
      })
      .state('app.portal.ThingViews.LocationThingDetail', {
        url: '/LocationView/ThingDetail/:thingid?from',
        templateUrl: 'app/components/portal/ThingViews/ThingDetail/ThingDetail.html',
        controller: 'ThingDetailController',
        previous: 'app.portal.ThingViews.LocationView',
        stateName: '设备详情'
      })
      .state('app.portal.ThingViews.TypeThingDetail', {
        url: '/TypeView/ThingList/:typeName/ThingDetail/:thingid?from',
        templateUrl: 'app/components/portal/ThingViews/ThingDetail/ThingDetail.html',
        controller: 'ThingDetailController',
        previous: 'app.portal.ThingViews.TypeThingList',
        stateName: '设备详情'
      })
      .state('app.portal.ThingViews.TypeThingList', {
        url: '/TypeView/ThingList/:typeName?from',
        templateUrl: 'app/components/portal/ThingViews/ThingList/ThingList.html',
        controller: 'ThingListController',
        previous: 'app.portal.ThingViews.TypeView',
        stateName: '设备列表'
      })
      .state('app.portal.ThingViews.TagThingDetail', {
        url: '/TagView/TagThingList/:displayName/ThingDetail/:thingid?from',
        templateUrl: 'app/components/portal/ThingViews/ThingDetail/ThingDetail.html',
        controller: 'ThingDetailController',
        previous: 'app.portal.ThingViews.TagThingList',
        stateName: '设备详情'
      })
      .state('app.portal.ThingViews.TagThingList', {
        url: '/TagView/ThingList/:displayName/?type&from',
        templateUrl: 'app/components/portal/ThingViews/ThingList/ThingList.html',
        controller: 'ThingListController',
        previous: 'app.portal.ThingViews.TagView',
        stateName: '设备列表'
      })
      .state('app.portal.ThingViews.LocationThingACL', {
        url: '/LocationView/ThingDetail/:thingid/acl?from',
        templateUrl: 'app/components/portal/ThingViews/ThingACL/ThingACL.html',
        controller: 'ThingACLController',
        previous: 'app.portal.ThingViews.LocationThingDetail',
        stateName: '设备使用权限'
      });
  });