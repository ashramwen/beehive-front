'use strict';

angular.module('BeehivePortal')
  .controller('LineChartController', ['$scope', '$rootScope', '$state', 'AppUtils', 'LineChartService', '$timeout',function($scope, $rootScope, $state, AppUtils, LineChartService, $timeout) {
    

    $scope.period = new KiiReporting.KiiTimePeriod(null);
    
    $scope.chartSources = [
      {value: 'value', text: '电量使用'},
      {value: 'rate', text: '功率'}
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
      LineChartService.getQuery().then(function(result){
        $scope.lineLevel = 0;
        $scope.lineSplitQuery = result.lineQuery;
        $scope.barQuery = result.barQuery;
        $scope.lineGroupQuery = result.lineGroupQuery;
        $scope.lineQuery = result.lineGroupQuery;
      });
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
      $scope.refreshLine();
      $scope.refreshPie();
      $scope.refreshBar();
    };

    $scope.groupLines = function(){
      $scope.lineLevel = 0;
      $scope.lineQuery = $scope.lineGroupQuery;
      $scope.split = false;

      $timeout(function(){
        $scope.refreshLine();
      });
    };

    $scope.splitLine = function(){
      $scope.lineLevel = 1;
      $scope.lineQuery = $scope.lineSplitQuery;
      $scope.split = true;

      $timeout(function(){
        $scope.refreshLine();
      });
    }

    $scope.getSummary = function(data){
      $timeout(function(){
        $scope.sumKwh = (data.summary.MaxKwh - data.summary.MinKwh) | 0;
      });
    };

    $rootScope.$watch('login', function(newVal){
      if(newVal){
        $scope.init();
      }
    });

    $scope.locationChange = function(location){
      console.log(location);
    };


  }]);
