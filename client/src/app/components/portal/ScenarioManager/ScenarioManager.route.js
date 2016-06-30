'use strict';

angular.module('BeehivePortal.ScenarioManager')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.ScenarioManager.OfficeAtmosphere', {
        url: '/OfficeAtmosphere',
        templateUrl: 'app/components/portal/ScenarioManager/OfficeAtmosphere/OfficeAtmosphere.html',
        controller: 'OfficeAtmosphereController',
        stateName: '办公室气候',
        previous: 'app.portal.ScenarioManager'
      });
  });
