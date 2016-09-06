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
        stateName: 'thingViews.typeView',
        previous: 'app.portal.ThingViews'
      })
      .state('app.portal.ThingViews.LocationThingDetail', {
        url: '/LocationView/ThingDetail/:thingid?type&location',
        templateUrl: 'app/components/portal/ThingViews/ThingDetail/ThingDetail.html',
        controller: 'ThingDetailController',
        previous: 'app.portal.ThingViews.LocationView',
        stateName: 'thingViews.thingDetail'
      })
      .state('app.portal.ThingViews.ControlThing', {
        url: '/ControlThing?refreshId',
        templateUrl: 'app/components/portal/ThingViews/ControlThing/ControlThing.html',
        controller: 'ControlThingController',
        stateName: 'thingViews.controlThings',
        previous: 'app.portal.ThingViews'
      });
  });