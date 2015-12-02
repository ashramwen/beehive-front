'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.ThingManager.LocationView', {
        url: '/LocationView',
        templateUrl: 'app/components/portal/ThingManager/LocationView/LocationView.html',
        controller: 'LocationViewController',
      })
      .state('app.portal.ThingManager.TypeView', {
        url: '/TypeView',
        templateUrl: 'app/components/portal/ThingManager/TypeView/TypeView.html',
        controller: 'TypeViewController',
      })
      .state('app.portal.ThingManager.TagView', {
        url: '/TagView',
        templateUrl: 'app/components/portal/ThingManager/TagView/TagView.html',
        controller: 'TagViewController',
      })
      .state('app.portal.ThingManager.ThingDetail', {
        url: '/ThingDetail?id&from',
        templateUrl: 'app/components/portal/ThingManager/ThingDetail/ThingDetail.html',
        controller: 'ThingDetailController'
      })
      .state('app.portal.ThingManager.ThingList', {
        url: '/ThingList?type&id&from',
        templateUrl: 'app/components/portal/ThingManager/ThingList/ThingList.html',
        controller: 'ThingListController'
      });
  });
