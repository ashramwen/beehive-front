
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

    $scope.$watch('login', function(newVal){
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
    $scope.activeIndex = chart.complex? 1:0;
    $scope.dataset = {};

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
    $scope.dataset.selectedType = null;
    $scope.selectedLocation = null;
    $scope.editor = null;

    $scope.options = {
      name: '',
      type: '',
      index: AppConfig.kiiAppID,
      chartType: 'line',
      dimensions: {
        location: true,
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

    $scope.init = function(){
      EditChartService.getAllTypes().then(function(types){
        $scope.typeOptions = types;

        if($scope.typeOptions.length > 0){
          if(chart.options.type){
            $scope.dataset.selectedType = _.find($scope.typeOptions, {value: chart.options.type.typeName});
          }else{
            $scope.dataset.selectedType = $scope.typeOptions[0];
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
        if(chart.options.complexQuery){
          $scope.editor1.set(chart.options.complexQuery);
        }

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
      $scope.date = timeSlice;
    };

    $scope.removeLocation = function(location){
      $scope.options.locations.remove(location);
    };

    $scope.saveChart = function(){
      $scope.options.level = ($scope.options.dimensions.time 
              && $scope.options.dimensions.location) ? 1 : 0;
        
      chart.name = $scope.options.name;
      chart.description = $scope.options.description;
      chart.options = $scope.options;
      $scope.options.type = {
        typeName: $scope.dataset.selectedType.value,
        displayName: $scope.dataset.selectedType.text
      };

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

    $scope.showDemoCode = function(){
      $scope.level = ($scope.options.dimensions.time 
              && $scope.options.dimensions.location) ? 1 : 0;
      $scope.options.type = {
        typeName: $scope.dataset.selectedType.value,
        displayName: $scope.dataset.selectedType.text
      };
      CustomChartsService.buildQueryFromOptions($scope.options).then(function(query){
        $scope.query = query;
        $timeout(function(){
          $scope.$broadcast('on-demo-refresh');
        });
      });
    };

    $scope.saveComplexChart = function(){
      $scope.options.complexQuery = $scope.editor1.get();
      CustomChartsService
        .buildComplexQueryFromOptions($scope.options).then(function(result){
          $scope.options.query = result.query;
          $scope.options.interval = result.date.interval;
          $scope.options.timeUnit = result.date.unit;

          chart.complex = true;
          chart.options = $scope.options;
          chart.name = $scope.options.name;
          chart.description = $scope.options.description;
          delete chart.options.name;
          delete chart.options.description;
          chart.save().then(function(){
            $uibModalInstance.close(chart);
          });
        });
    };

    $scope.selectExample = function(option){
      $scope.selectedExample = option;
      $scope.editor2.set(option.code);
    };

    $scope.showComplexDemoCode = function(){
      $scope.options.complexQuery = $scope.editor1.get();

      CustomChartsService
        .buildComplexQueryFromOptions($scope.options).then(function(result){
          $uibModal.open({
            animation: true,
            windowClass: 'app-portal-reporting-customcharts-modal',
            templateUrl: 'custom-chart-code-demo',
            controller: 'CustomChartsController.DemoCodeModal',
            size: 'md',
            resolve: {
              query: function() {
                return result.query;
              },
              date: function(){
                return result.date;
              }
            }
          });
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
  .controller('CustomChartsController.DemoCodeModal', ['$scope', 'query', '$uibModalInstance', 'date', function($scope, query, $uibModalInstance, date){
    $scope.query = query;
    $scope.date = date;

    $scope.dismiss = function(){
      $uibModalInstance.dismiss();
    };

  }])
  .controller('CustomChartsController.DemoCode', ['$scope', function($scope){

    var from = new Date();
    var to = new Date();

    from.setDate(from.getDate() - 1);

    $scope.defaultTime = {
      from: from,
      to: to
    };

    $scope.$on('on-demo-refresh', function(){
      if($scope.date){
        $scope.period.setUnit($scope.date.unit);
        $scope.period.setInterval($scope.date.interval);
      }
      $scope.refreshChart();
    });

    $scope.period = new KiiReporting.KiiTimePeriod(null);

    $scope.period.setFromTime(from);
    $scope.period.setToTime(to);

    if($scope.date){
      $scope.period.setUnit($scope.date.unit);
      $scope.period.setInterval($scope.date.interval);
    }

    $scope.onPeriodChange = function(period){
      $scope.period.setFromTime(period.from);
      $scope.period.setToTime(period.to);
    };

    $scope.refresh = function(){
      $scope.refreshChart();
    };
  }]);






