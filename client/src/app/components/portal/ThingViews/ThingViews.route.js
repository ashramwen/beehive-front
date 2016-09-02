'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.ThingViews.LocationView', {
        url: '/LocationView?type&location',
        templateUrl: 'app/components/portal/ThingViews/LocationView/LocationView.html',
        controller: 'LocationViewController',
        previous: 'app.portal.ThingViews.TypeView',
        stateName: 'thingViews.locationView'
      })
      .state('app.portal.ThingViews.TypeView', {
        url: '/TypeView?location',
        templateUrl: 'app/components/portal/ThingViews/TypeView/TypeView.html',
        controller: 'TypeViewController',
        stateName: 'thingViews'
      })
      .state('app.portal.ThingViews.LocationThingDetail', {
        url: '/LocationView/ThingDetail/:thingid?type&location',
        templateUrl: 'app/components/portal/ThingViews/ThingDetail/ThingDetail.html',
        controller: 'ThingDetailController',
        previous: 'app.portal.ThingViews.LocationView',
        stateName: 'thingViews.thingDetail'
      });
  });