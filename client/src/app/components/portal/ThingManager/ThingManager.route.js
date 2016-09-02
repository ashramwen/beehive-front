'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.ThingManager.Gateway', {
        url: '/Gateway?gateway&location',
        templateUrl: 'app/components/portal/ThingManager/Gateway/Gateway.html',
        controller: 'GatewayController',
        stateName: 'thingManager.gatewayManagement',
        previous: 'app.portal.ThingManager'
      })
      .state('app.portal.ThingManager.ControlThing', {
        url: '/ControlThing?refreshId',
        templateUrl: 'app/components/portal/ThingManager/ControlThing/ControlThing.html',
        controller: 'ControlThingController',
        stateName: 'thingManager.controlThings',
        previous: 'app.portal.ThingManager'
      })
      .state('app.portal.ThingManager.ThingDetail', {
        url: '/ThingDetail/:thingid?gateway&location',
        templateUrl: 'app/components/portal/ThingViews/ThingDetail/ThingDetail.html',
        controller: 'ThingDetailController',
        previous: 'app.portal.ThingManager.Gateway',
        stateName: 'thingViews.thingDetail'
      });
  });
