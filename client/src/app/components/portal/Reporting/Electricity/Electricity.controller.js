'use strict';

angular.module('BeehivePortal')
  .controller('ElectricityController', ['$scope', '$rootScope', '$state', 'AppUtils', 'ElectricityService', '$timeout', 'ReportingService', function($scope, $rootScope, $state, AppUtils, ElectricityService, $timeout, ReportingService) {
    

    $scope.period = new KiiReporting.KiiTimePeriod(null);
    
    $scope.chartSources = [
      {value: 'value', text: '电量使用'}
    ];

    $scope.selectedSource = 'value';

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

        $scope.lineLevel = 0;
        $scope.split = false;
        $scope.lineQuery = ElectricityService.generateConsumption(true, false, queriedSubLevels);
        $scope.barQuery = ElectricityService.generateConsumption(false, false, queriedSubLevels);
        $scope.pieQuery = ElectricityService.generateConsumption(false, false, queriedSubLevels);

        ElectricityService.getConsumeSummary($scope.period, queriedSubLevels).then(function(result){
          $scope.totalConsump = result;
        });

        $timeout(function(){
          $scope.refreshLine();
          $scope.refreshPie();
          $scope.refreshBar();
        });
      });
    };

    $scope.groupLines = function(){
      $scope.lineLevel = 0;
      $scope.split = false;
      $scope.lineQuery = ElectricityService.generateConsumption(true,  $scope.split);

      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $scope.splitLine = function(){
      $scope.lineLevel = 1;
      $scope.split = true;
      $scope.lineQuery = ElectricityService.generateConsumption(true,  $scope.split);

      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $scope.locationChange = function(location, locationName, subLevels){
      $scope.selectedLocation = {
        location: location,
        displayName: locationName
      };

      $scope.selectedSubLevels = subLevels;
    };

    $rootScope.$watch('login', function(newVal){
      if(newVal){
        $scope.init();
      }
    });


  }]);
