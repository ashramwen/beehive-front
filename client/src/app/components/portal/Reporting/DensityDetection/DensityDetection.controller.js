'use strict';

angular.module('BeehivePortal')
  .controller('DensityDetectionController', ['$scope', '$rootScope', '$state', 'AppUtils', 'DensityDetectionService', '$timeout', function($scope, $rootScope, $state, AppUtils, DensityDetectionService, $timeout) {

    $scope.period = new KiiReporting.KiiTimePeriod(null);

    $scope.chartSources = [
      {value: 'value', text: '人气值'},
      {value: 'rate', text: '占用率'}
    ];

    $scope.selectedSource = 'value';

    $scope.aggMethods = [
      {value: 'avg', text: '平均值'},
      {value: 'max', text: '最大值'},
      {value: 'min', text: '最小值'},
      {value: 'count', text: '计数'}
    ];

    $scope.selectedMethod = 'avg';

    $scope.locationChange = function(){
      
    };

    $scope.init = function(){
      $scope.lineQuery = DensityDetectionService.ganzhiGroupSample;
      $scope.lineLevel = 0;
      $scope.barQuery = DensityDetectionService.ganzhiByLocSample;
      $scope.pieQuery = DensityDetectionService.ganzhiByLocSample;
      $scope.summaryQuery = DensityDetectionService.summaryQuery;
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
      $scope.refreshBar();
      $scope.refreshPie1();
      $scope.refreshLine();
      $scope.refreshPie2();
    };

    $scope.groupLines = function(){
      $scope.lineQuery = DensityDetectionService.ganzhiGroupSample;
      $scope.lineLevel = 0;
      $scope.split = false;
      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $scope.splitLine = function(){
      $scope.lineQuery = DensityDetectionService.ganzhiSample;
      $scope.lineLevel = 1;
      $scope.split = true;

      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $scope.getFigure = function(response){
      $scope.numberDetected = response.data.Detected['已使用空间'].countT;
      $scope.$apply();
    };

    $rootScope.$watch('login', function(newVal){
      if(newVal){
        $scope.init();
      }
    });

  }]);