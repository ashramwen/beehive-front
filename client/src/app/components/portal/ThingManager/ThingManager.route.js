'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.ThingManager.AddThing', {
        url: '/AddThing',
        templateUrl: 'app/components/portal/ThingManager/AddThing/AddThing.html',
        controller: 'AddThingController',
        stateName: '添加新设备',
        previous: 'app.portal.ThingManager'
      })
      .state('app.portal.ThingManager.Gateway', {
        url: '/Gateway',
        templateUrl: 'app/components/portal/ThingManager/Gateway/Gateway.html',
        controller: 'GatewayController',
        stateName: '网关',
        previous: 'app.portal.ThingManager'
      })
      .state('app.portal.ThingManager.ControlThing', {
        url: '/ControlThing',
        templateUrl: 'app/components/portal/ThingManager/ControlThing/ControlThing.html',
        controller: 'ControlThingController',
        stateName: '控制设备',
        previous: 'app.portal.ThingManager'
      });
  });
