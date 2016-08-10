'use strict';

angular.module('BeehivePortal')
  .controller('EnvironmentController', ['$scope', '$rootScope', '$state', 'AppUtils', 'EnvironmentService', '$timeout', '$$Thing', '$q', 'ReportingService', function($scope, $rootScope, $state, AppUtils, EnvironmentService, $timeout, $$Thing, $q, ReportingService) {
    

    $scope.period = new KiiReporting.KiiTimePeriod(null);
    $scope.barChartPeriod = new KiiReporting.KiiTimePeriod(null);
    $scope.barChartPeriod.setUnit('m');
    $scope.barChartPeriod.setInterval(1);

    
    $scope.chartSources = [
      {value: 'CO2', text: '二氧化碳'},
      {value: 'Temp', text: '温度'},
      {value: 'Noise', text: '噪音指数'},
      {value: 'Bri', text: '亮度'},
      {value: 'PM25', text: 'PM25'},
      {value: 'Humidity', text: '湿度'},
      {value: 'VOC', text: '空气质量'},
      {value: 'Smoke', text: '烟尘'}
    ];

    $scope.selectedSource = $scope.chartSources[0];
    $scope.queriedSource = $scope.selectedSource

    $scope.aggMethods = [
      {value: 'avg', text: '平均值'},
      {value: 'max', text: '最大值'},
      {value: 'min', text: '最小值'}
    ];

    $scope.selectedMethod = 'avg';

    $scope.init = function(){
      $scope.lineLevel = 0;
      $scope.getSummaryData();
      $scope.barQuery = EnvironmentService.getEnvironmentQuery($scope.selectedMethod, $scope.selectedSource.value, $scope.selectedSource.text, false);
      $scope.lineQuery = EnvironmentService.getEnvironmentQuery($scope.selectedMethod, $scope.selectedSource.value, $scope.selectedSource.text, true, false);
    };

    $scope.onPeriodChange = function(_period){
      $scope.period.setFromTime(_period.from);
      $scope.period.setToTime(_period.to);
      $scope.barChartPeriod.setFromTime(_period.from);
      $scope.barChartPeriod.setToTime(_period.to);
    };

    $scope.onTimeSliceChange = function(_timeSlice){
      $scope.period.setUnit(_timeSlice.unit);
      $scope.period.setInterval(_timeSlice.interval);
    };

    $scope.queryData = function(){
      $scope.getSummaryData();

      ReportingService.getLocationThings('EnvironmentSensor', $scope.selectedSubLevels).then(function(queriedSubLevels){
        var queriedSubLevels = queriedSubLevels;

        $scope.lineLevel = 0;
        $scope.split = false;

        $scope.barQuery = EnvironmentService.getEnvironmentQuery($scope.selectedMethod, $scope.selectedSource.value, $scope.selectedSource.text, false);
        $scope.lineQuery = EnvironmentService.getEnvironmentQuery($scope.selectedMethod, $scope.selectedSource.value, $scope.selectedSource.text, true, false);

        $scope.queriedSource = $scope.selectedSource;
        $timeout(function(){
          $scope.refreshLine();
          $scope.refreshBar();
        });
      });
    };

    $scope.groupLines = function(){
      $scope.lineLevel = 0;
      $scope.lineQuery = EnvironmentService.getEnvironmentQuery($scope.selectedMethod, $scope.selectedSource.value, $scope.selectedSource.text, true, false);
      $scope.split = false;

      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $scope.splitLine = function(){
      $scope.lineLevel = 1;
      $scope.lineQuery = EnvironmentService.getEnvironmentQuery($scope.selectedMethod, $scope.selectedSource.value, $scope.selectedSource.text, true, true);
      $scope.split = true;

      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $rootScope.$watch('login', function(newVal){
      if(newVal){
        $scope.init();
      }
    });

    $scope.locationChange = function(location, locationName, subLevels){
      $scope.selectedLocation = {
        location: location,
        displayName: locationName
      };

      $scope.selectedSubLevels = subLevels;
    };

    $scope.getSummaryData = function(){
      EnvironmentService.getSummaryData($scope.selectedSource.value).then(function(data){
        if(data) data = data.toFixed(2);
        $scope.summaryData = data;
      });
    };


  }]);
