'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.Reporting.Electricity', {
        url: '/Electricity',
        templateUrl: 'app/components/portal/Reporting/Electricity/Electricity.html',
        controller: 'ElectricityController',
        stateName: 'reporting.energyReporting',
        previous: 'app.portal.Reporting'
      })
      .state('app.portal.Reporting.Environment', {
        url: '/Environment',
        templateUrl: 'app/components/portal/Reporting/Environment/Environment.html',
        controller: 'EnvironmentController',
        stateName: 'reporting.environmentReporting',
        previous: 'app.portal.Reporting'
      })
      .state('app.portal.Reporting.DensityDetection', {
        url: '/DensityDetection',
        templateUrl: 'app/components/portal/Reporting/DensityDetection/DensityDetection.html',
        controller: 'DensityDetectionController',
        stateName: 'reporting.densityReporting',
        previous: 'app.portal.Reporting'
      })
      .state('app.portal.Reporting.CustomCharts', {
        url: '/CustomCharts',
        templateUrl: 'app/components/portal/Reporting/CustomCharts/CustomCharts.html',
        controller: 'CustomChartsController',
        stateName: 'reporting.customCharts',
        previous: 'app.portal.Reporting'
      });
  });
