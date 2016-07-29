'use strict';

angular.module('BeehivePortal')
  .controller('FaceDetectionController', ['$scope', '$rootScope', '$state', 'AppUtils', 'FaceDetectionService', '$timeout', function($scope, $rootScope, $state, AppUtils, FaceDetectionService, $timeout) {

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

    $scope.locations = [
      {text: '栋11-F22-A区', value: 'B11-F22-bA'}
    ];
    $scope.selectedLocation = 'B11-F22-bA';

    $scope.init = function(){
      $scope.lineQuery = FaceDetectionService.ganzhiGroupSample;
      $scope.lineLevel = 0;
      $scope.barQuery = FaceDetectionService.ganzhiByLocSample;
      $scope.pieQuery = FaceDetectionService.ganzhiByLocSample;
      $scope.summaryQuery = FaceDetectionService.summaryQuery;
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
      $scope.lineQuery = FaceDetectionService.ganzhiGroupSample;
      $scope.lineLevel = 0;
      $scope.split = false;
      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $scope.splitLine = function(){
      $scope.lineQuery = FaceDetectionService.ganzhiSample;
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