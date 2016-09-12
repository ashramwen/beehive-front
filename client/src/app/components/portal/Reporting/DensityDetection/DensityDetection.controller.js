'use strict';

angular.module('BeehivePortal')
  .controller('DensityDetectionController', ['$scope', '$rootScope', '$state', 'AppUtils', 'DensityDetectionService', '$timeout', 'ReportingService', '$translate', function($scope, $rootScope, $state, AppUtils, DensityDetectionService, $timeout, ReportingService, $translate) {

    $scope.period = new KiiReporting.KiiTimePeriod(null);

    $scope.chartSources = [
      {value: 'value', text: 'reporting.density'},
      {value: 'rate', text: 'reporting.densityRatio'}
    ];

    $scope.selectedSource = $scope.chartSources[0];
    $scope.queriedSource = $scope.selectedSource;

    _.each($scope.chartSources, function(source){
      $translate(source.text).then(function(result){
        source.text = result;
      }, function(error){
        source.text = source.text;
      });
    });

    $scope.init = function(){
      
    };

    $scope.onPeriodChange = function(_period){
      $scope.period.setFromTime(_period.from);
      $scope.period.setToTime(_period.to);
    };

    $scope.onTimeSliceChange = function(_timeSlice){
      $scope.period.setUnit(_timeSlice.unit);
      $scope.period.setInterval(_timeSlice.interval);
    };

    $scope.queryData = function(){

      ReportingService.getLocationThings('EnvironmentSensor', $scope.selectedSubLevels).then(function(queriedSubLevels){
        var queriedSubLevels = queriedSubLevels;
        $scope.queriedSource = $scope.selectedSource;

        $scope.queriedSubLevels = queriedSubLevels;
        $scope.lineLevel = 0;
        $scope.split = false;
        $scope.summaryQuery = DensityDetectionService.generateSummaryQuery(queriedSubLevels);
        $scope.lineQuery = DensityDetectionService.generateLineQuery($scope.split, $scope.selectedSource.value, queriedSubLevels);
        $scope.barQuery = DensityDetectionService.generateBarQuery($scope.selectedSource.value, queriedSubLevels);
        $scope.pieQuery = DensityDetectionService.generatePieQuery(queriedSubLevels);

        $timeout(function(){
          $scope.refreshBar();
          $scope.refreshLine();
          $scope.refreshSummary();
          $scope.refreshPie();
        });
      });

    };

    $scope.groupLines = function(){
      $scope.lineLevel = 0;
      $scope.split = false;
      $scope.lineQuery = DensityDetectionService.generateLineQuery($scope.split, $scope.selectedSource.value, $scope.queriedSubLevels);

      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $scope.splitLine = function(){
      $scope.lineLevel = 1;
      $scope.split = true;
      $scope.lineQuery = DensityDetectionService.generateLineQuery($scope.split, $scope.selectedSource.value, $scope.queriedSubLevels);

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

  }]);