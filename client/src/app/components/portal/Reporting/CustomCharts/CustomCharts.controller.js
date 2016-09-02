
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
  .controller('CustomChartsController.editChart', ['$scope', '$uibModalInstance', 'chart', '$q', 'EditChartService', 'CustomChartsService', '$timeout', function($scope, $uibModalInstance, chart, $q, EditChartService, CustomChartsService, $timeout){

    $scope.modalTitle = _.isEmpty(chart.id)? 'reporting.createChartTitle' : 'reporting.editChartTitle';

    $scope.chartTypes = [
      {text: 'reporting.lineChart', value: 'line'},
      {text: 'reporting.barChart', value: 'bar'},
      {text: 'reporting.pieChart', value: 'pie'}
    ];

    $scope.typeOptions = [];
    $scope.selectedType = null;
    $scope.selectedLocation = null;

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

    $scope.cancel = function(){
      $uibModalInstance.dismiss();
    };

  }]);