'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.Reporting.LineChart', {
        url: '/LineChart',
        templateUrl: 'app/components/portal/Reporting/LineChart/LineChart.html',
        controller: 'LineChartController',
        stateName: '折线图',
        previous: 'app.portal.Reporting'
      })
      .state('app.portal.Reporting.FaceDetection', {
        url: '/FaceDetection',
        templateUrl: 'app/components/portal/Reporting/FaceDetection/FaceDetection.html',
        controller: 'FaceDetectionController',
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
