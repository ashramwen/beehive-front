'use strict';

angular.module('BeehivePortal')
  .controller('EnvironmentController', ['$scope', '$rootScope', '$state', 'AppUtils', 'EnvironmentService', '$timeout', '$$Thing', '$q', 'ReportingService', '$translate', function($scope, $rootScope, $state, AppUtils, EnvironmentService, $timeout, $$Thing, $q, ReportingService, $translate) {
    

    $scope.period = new KiiReporting.KiiTimePeriod(null);
    $scope.barChartPeriod = new KiiReporting.KiiTimePeriod(null);
    $scope.barChartPeriod.setUnit('m');
    $scope.barChartPeriod.setInterval(1);

    
    $scope.chartSources = [
      {value: 'CO2', text: 'reporting.CO2'},
      {value: 'Temp', text: 'reporting.Temp'},
      {value: 'Noise', text: 'reporting.Noise'},
      {value: 'Bri', text: 'reporting.Bri'},
      {value: 'PM25', text: 'reporting.PM25'},
      {value: 'Humidity', text: 'reporting.Humidity'},
      {value: 'VOC', text: 'reporting.VOC'},
      {value: 'Smoke', text: 'reporting.Smoke'}
    ];

    _.each($scope.chartSources, function(source){
      $translate(source.text).then(function(result){
        source.text = result;
      }, function(error){
        source.text = source.text;
      });
    });

    $scope.selectedSource = $scope.chartSources[0];
    $scope.queriedSource = $scope.selectedSource

    $scope.aggMethods = [
      {value: 'avg', text: 'terms.avg'},
      {value: 'max', text: 'terms.max'},
      {value: 'min', text: 'terms.min'}
    ];

    $scope.selectedMethod = 'avg';

    $scope.init = function(){
      $scope.lineLevel = 0;
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

      ReportingService.getLocationThings('EnvironmentSensor', $scope.selectedSubLevels).then(function(queriedSubLevels){
        $scope.queriedSubLevels = queriedSubLevels;

        $scope.lineLevel = 0;
        $scope.split = false;

        $scope.getSummaryData($scope.queriedSubLevels);
        $scope.barQuery = EnvironmentService.getEnvironmentQuery($scope.selectedMethod, $scope.selectedSource.value, $scope.selectedSource.text, false, false, $scope.queriedSubLevels);
        $scope.lineQuery = EnvironmentService.getEnvironmentQuery($scope.selectedMethod, $scope.selectedSource.value, $scope.selectedSource.text, true, false, $scope.queriedSubLevels);

        $scope.queriedSource = $scope.selectedSource;
        $timeout(function(){
          $scope.refreshLine();
          $scope.refreshBar();
        });
      });
    };

    $scope.groupLines = function(){
      $scope.lineLevel = 0;
      $scope.lineQuery = EnvironmentService.getEnvironmentQuery($scope.selectedMethod, $scope.selectedSource.value, $scope.selectedSource.text, true, false, $scope.queriedSubLevels);
      $scope.split = false;

      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $scope.splitLine = function(){
      $scope.lineLevel = 1;
      $scope.lineQuery = EnvironmentService.getEnvironmentQuery($scope.selectedMethod, $scope.selectedSource.value, $scope.selectedSource.text, true, true, $scope.queriedSubLevels);
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

    $scope.getSummaryData = function(subLevels){
      EnvironmentService.getSummaryData($scope.selectedSource.value, subLevels).then(function(data){
        if(data) data = data.toFixed(2);
        $scope.summaryData = data;
      });
    };


  }]);
