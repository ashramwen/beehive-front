
angular.module('BeehivePortal')
  .controller('CustomChartsController', ['$scope', '$rootScope', '$state', 'AppUtils', 'CustomChartsService', '$timeout', '$uibModal', function($scope, $rootScope, $state, AppUtils, CustomChartsService, $timeout, $uibModal) {
    
    var from = new Date();
    var to = new Date();

    from.setDate(from.getDate() - 1);

    $scope.defaultTime = {
      from: from,
      to: to
    };

    $scope.period = {
      from: $scope.defaultTime.from,
      to: $scope.defaultTime.to
    };

    $scope.init = function(){
      $scope.gridsterOpts = CustomChartsService.gridsterOpts 
      $scope.customChartMap = CustomChartsService.customChartMap;
      CustomChartsService.refresh().then(function(charts){
        $scope.charts = charts;
      });
    };

    $scope.onPeriodChange = function(period){
      $scope.period.from = period.from;
      $scope.period.to = period.to;
    };

    $scope.queryData = function(){
      _.each($scope.charts, function(chart){
        chart.setPeriod($scope.period);
        chart.refresh();
      });
    };

    $scope.factoryChart = function(){
      var newChart = CustomChartsService.factoryChart();

      editChart(newChart).then(function(chart){
        CustomChartsService.charts.unshift(chart);
        $timeout(function(){
          chart.setPeriod($scope.period);
          chart.refresh();
        });
        console.log(CustomChartsService.charts);
      });
    };

    $rootScope.$watch('login', function(newVal){
      if(newVal){
        $scope.init();
      }
    });

    $scope.removeChart = function(chart){
      var options = {
        msg: 'reporting.removeCustomChartMsg',
        callback: function(){
          chart.remove().then(function(){
            $scope.charts.remove(chart);
          });
        }
      };
      AppUtils.confirm(options);
    };

    $scope.editChart = function(chart){
      editChart(chart).then(function(){
        $timeout(function(){
          chart.setPeriod($scope.period);
          chart.refresh();
        });
      });
    };

    function editChart(chart){
      return $uibModal.open({
        animation: true,
        windowClass: 'app-portal-reporting-customcharts-modal',
        templateUrl: 'edit-custom-chart',
        controller: 'CustomChartsController.editChart',
        size: 'md',
        resolve: {
          chart: function() {
            return chart;
          }
        }
      }).result;
    };
  }])
  .controller('CustomChartsController.editChart', ['$scope', '$uibModalInstance', 'chart', '$q', 'EditChartService', 'CustomChartsService', '$timeout', 'CodeExampleService', '$uibModal',
      function($scope, $uibModalInstance, chart, $q, EditChartService, CustomChartsService, $timeout, CodeExampleService, $uibModal){

    $scope.modalTitle = _.isEmpty(chart.id)? 'reporting.createChartTitle' : 'reporting.editChartTitle';

    $scope.chartTypes = [
      {text: 'reporting.lineChart', value: 'line'},
      {text: 'reporting.barChart', value: 'bar'},
      {text: 'reporting.pieChart', value: 'pie'}
    ];
    $scope.exampleOptions = [
      {code: CodeExampleService.lineChartExample, tabName: '折线图'},
      {code: CodeExampleService.barChartExample, tabName: '柱状图'},
      {code: CodeExampleService.pieChartExample, tabName: '饼图'}
    ];
    $scope.selectedExample = null;

    $scope.typeOptions = [];
    $scope.selectedType = null;
    $scope.selectedLocation = null;
    $scope.editor = null;

    $scope.options = {
      name: '',
      type: '',
      index: AppConfig.kiiAppID,
      chartType: 'line',
      dimensions: {
        location: false,
        time: false
      },
      locations: [],
      timeUnit: 'm',
      interval: 30,
      aggMethod: 'avg',
      property: null
    };

    $scope.aggMethods = [
      {value: 'avg', text: 'terms.avg'},
      {value: 'max', text: 'terms.max'},
      {value: 'min', text: 'terms.min'}
    ];

    $scope.$watch('selectedType', function(type){
      if(!type)return;
      $scope.options.type = {
        typeName: type.value,
        displayName: type.text
      };
    });

    $scope.init = function(){
      EditChartService.getAllTypes().then(function(types){
        $scope.typeOptions = types;

        if($scope.typeOptions.length > 0){
          if(chart.options.type){
            $scope.selectedType = _.find($scope.typeOptions, {value: chart.options.type.typeName});
          }else{
            $scope.selectedType = $scope.typeOptions[0];
          }
        }
        _.extend($scope.options, chart.options);
        _.extend($scope.options, {
          name: chart.name,
          description: chart.description
        });

        $scope.$broadcast('timeslice-input', {
          unit: $scope.options.timeUnit, 
          interval: $scope.options.interval
        });

        var container = document.getElementById("jsoneditor1");
        var options = {mode: 'code'};
        $scope.editor1 = new JSONEditor(container, options);

        var container = document.getElementById("jsoneditor2");
        var options = {mode: 'code'};
        $scope.editor2 = new JSONEditor(container, options);
        $timeout(function(){
          $scope.selectExample($scope.exampleOptions[0]);
        });
      });
    };

    $scope.$watch('login', function(val){
      if(!val) return;
      $scope.init();
    });

    $scope.locationChange = function(location, locationName){
      $scope.selectedLocation = {
        location: location,
        displayName: locationName
      };
    };

    $scope.addLocation = function(){
      if(!$scope.selectedLocation) return;
      if(! _.find($scope.options.locations, {location: $scope.selectedLocation.location})){
        $scope.options.locations.push($scope.selectedLocation);
      }
    };

    $scope.removeLocation = function(location){
      $scope.options.locations = _.reject($scope.options.locations, {location: location.location});
    };

    $scope.onTimeSliceChange = function(timeSlice){
      $scope.options.timeUnit = timeSlice.unit;
      $scope.options.interval = timeSlice.interval;
    };

    $scope.removeLocation = function(location){
      $scope.options.locations.remove(location);
    };

    $scope.saveChart = function(){
      $scope.options.query = CustomChartsService.buildQueryFromOptions($scope.options);
      $scope.options.level = ($scope.options.dimensions.time 
              && $scope.options.dimensions.location) ? 1 : 0;
        
      chart.name = $scope.options.name;
      chart.description = $scope.options.description;
      chart.options = $scope.options;

      CustomChartsService.buildQueryFromOptions($scope.options).then(function(query){
        chart.options.query = query;
        delete $scope.options.name;
        delete $scope.options.description;
        console.log(chart);
        chart.save().then(function(){
          $uibModalInstance.close(chart);
        });
      });
    };

    $scope.saveComplexChart = function(){
      $scope.options.complexQuery = $scope.editor1.get();
      $scope.options.query = CustomChartsService
        .buildComplexQueryFromOptions($scope.options).then(function(result){
          $scope.showDemoCode(result.query, result.date);
        });
    };

    $scope.selectExample = function(option){
      $scope.selectedExample = option;
      $scope.editor2.set(option.code);
    };

    $scope.showDemoCode = function(query, date){
      $uibModal.open({
        animation: true,
        windowClass: 'app-portal-reporting-customcharts-modal',
        templateUrl: 'custom-chart-code-demo',
        controller: 'CustomChartsController.demoCode',
        size: 'md',
        resolve: {
          query: function() {
            return query;
          },
          date: function(){
            return date;
          }
        }
      });
    };

    $scope.copyExample = function(){
      $scope.editor1.set($scope.selectedExample.code);
    };

    $scope.cancel = function(){
      $uibModalInstance.dismiss();
    };

    $scope.dismiss = function(){
      $uibModalInstance.dismiss();
    };

  }])
  .controller('CustomChartsController.demoCode', ['query', '$scope', '$uibModalInstance', 'date', function(query, $scope, $uibModalInstance, date){
    $scope.query = query;
    $scope.refreshChart;

    var from = new Date();
    var to = new Date();

    from.setDate(from.getDate() - 1);

    $scope.period = new KiiReporting.KiiTimePeriod(null);

    $scope.period.setFromTime(from);
    $scope.period.setToTime(to);


    if(date){
      $scope.period.setUnit(date.unit);
      $scope.period.setInterval(date.interval);
    }

    $scope.onPeriodChange = function(period){
      $scope.period.setFromTime(period.from);
      $scope.period.setToTime(period.to);
    };

    $scope.refresh = function(){
      $scope.refreshChart();
    };

    $scope.dismiss = function(){
      $uibModalInstance.dismiss();
    };

  }]);