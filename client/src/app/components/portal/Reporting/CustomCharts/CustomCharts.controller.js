
angular.module('BeehivePortal')
  .controller('CustomChartsController', ['$scope', '$rootScope', '$state', 'AppUtils', 'CustomChartsService', '$timeout', function($scope, $rootScope, $state, AppUtils, CustomChartsService, $timeout) {
    
    $scope.onEdit = [];
    $scope.period = new KiiReporting.KiiTimePeriod(null);
    $scope.period.setFromTime(new Date('2015-01-01'));
    $scope.period.setToTime(new Date('2016-12-30'));
    $scope.period.setUnit('H');
    $scope.period.setInterval(1);

    $scope.init = function(){
      $scope.gridsterOpts = CustomChartsService.gridsterOpts 
      $scope.customChartMap = CustomChartsService.customChartMap;
      CustomChartsService.refresh().then(function(charts){
        $scope.charts = charts;
      });
    };

    $scope.factoryChart = function(){
      CustomChartsService.factoryChart();
      $scope.onEdit = [true].concat($scope.onEdit);
    };

    $rootScope.$watch('login', function(newVal){
      if(newVal){
        $scope.init();
      }
    });

    $scope.saveChart = function(chart, index){
      chart.save().then(function(){
        $scope.onEdit[index] = false;
      });
    };
  }]);