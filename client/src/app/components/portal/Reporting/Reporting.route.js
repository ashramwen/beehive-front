'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.Reporting.Environment', {
        url: '/Environment',
        templateUrl: 'app/components/portal/Reporting/Environment/Environment.html',
        controller: 'EnvironmentController',
        stateName: '环境监测',
        previous: 'app.portal.Reporting'
      })
      .state('app.portal.Reporting.DensityDetection', {
        url: '/DensityDetection',
        templateUrl: 'app/components/portal/Reporting/DensityDetection/DensityDetection.html',
        controller: 'DensityDetectionController',
        stateName: '位置感知',
        previous: 'app.portal.Reporting'
      })
      .state('app.portal.Reporting.CustomCharts', {
        url: '/CustomCharts',
        templateUrl: 'app/components/portal/Reporting/CustomCharts/CustomCharts.html',
        controller: 'CustomChartsController',
        stateName: '自定义图表',
        previous: 'app.portal.Reporting'
      });
  });
