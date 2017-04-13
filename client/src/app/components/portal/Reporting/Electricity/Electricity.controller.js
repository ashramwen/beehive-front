'use strict';

angular.module('BeehivePortal')
  .controller('ElectricityController', ['$scope', '$rootScope', '$state', 'AppUtils', 'ElectricityService', '$timeout', 'ReportingService', '$translate', function($scope, $rootScope, $state, AppUtils, ElectricityService, $timeout, ReportingService, $translate) {
    

    $scope.period = new KiiReporting.KiiTimePeriod(null);
    
    $scope.chartSources = [
      {value: 'value', text: 'reporting.energyConsumption'}
    ];

    $scope.selectedSource = 'value';

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

      ReportingService.getLocationThings('ElectricMeter', $scope.selectedSubLevels).then(function(queriedSubLevels){
        $scope.queriedSubLevels = queriedSubLevels;

        $scope.lineLevel = 0;
        $scope.split = false;
        $scope.lineQuery = ElectricityService.generateConsumption(true, false, $scope.queriedSubLevels);
        $scope.barQuery = ElectricityService.generateConsumption(false, false, $scope.queriedSubLevels);
        $scope.pieQuery = ElectricityService.generateConsumption(false, false, $scope.queriedSubLevels);

        ElectricityService.getConsumeSummary($scope.period, $scope.queriedSubLevels).then(function(result){
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
      $scope.lineQuery = ElectricityService.generateConsumption(true,  $scope.split, $scope.queriedSubLevels);

      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $scope.splitLine = function(){
      $scope.lineLevel = 1;
      $scope.split = true;
      $scope.lineQuery = ElectricityService.generateConsumption(true,  $scope.split, $scope.queriedSubLevels);

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

    $scope.$watch('login', function(newVal){
      if(newVal){
        $scope.init();
      }
    });


  }]);
