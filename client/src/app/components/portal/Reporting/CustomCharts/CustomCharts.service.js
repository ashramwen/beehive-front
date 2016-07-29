angular.module('BeehivePortal')
  .factory('CustomChartsService', ['$q', '$timeout', '$$User', 'AppUtils', function($q, $timeout, $$User, AppUtils){
    var CHART_ID_FIELD_NAME = 'KII_CHART';

    var _chartIDs = [];

    var CustomChartsService = {
      charts: [],
      refresh: function(){
        var $defer = $q.defer();

        $$User.getCustomData({type: CHART_ID_FIELD_NAME}, function(response){
          if(!response) return;
          _chartIDs = response.dataset || [];

          var quries = _.map(_chartIDs, function(id){
            return CustomChartsService.getChart(id);
          });

          $q.all(quries).then(function(response){
            CustomChartsService.charts = response;
            CustomChartsService.charts = _.map(CustomChartsService.charts, function(chart){
              return new CustomChart(chart);
            });
            CustomChartsService.charts = CustomChartsService.charts || [];
            $defer.resolve(CustomChartsService.charts);
          });

        });

        return $defer.promise;
      },
      update: function(){
        return $$User.putCustomData({type: CHART_ID_FIELD_NAME}, {dataset: _chartIDs}).$promise;
      },
      getChart: function(id){
        return $$User.getCustomData({type: id}).$promise;
      },
      addChart: function(chart){
        var id = chart.id;
        _chartIDs.push(chart.id);
        CustomChartsService.update();

        return $$User.putCustomData({type: id}, chart).$promise;
      },
      updateChart: function(chart){
        var id = chart.id;
        return $$User.putCustomData({type: id}, chart).$promise;
      },
      deleteChart: function(chart){
        var id = chart.id;
        return $$User.putCustomData({type: id}, {}).$promise;
      },
      refreshChart: function(id){
        return $$User.getCustomData({type: id}, function(data){
          var index = _.findIndex(CustomChartsService.charts, {id: id});
          CustomChartsService.charts[index] = new CustomChart(data);
        }).$promise;
      },
      CustomChart: CustomChart,
      factoryChart: function(){
        var chart = CustomChart.factory();
        CustomChartsService.charts.unshift(chart);
        return chart;
      }
    };

    function CustomChart(data){
      _.extend(this, {
        id: '',
        name: '',
        description: '',
        options: {
          level: 0,
          query:'',
          interval: 1,
          unit: 'H'
        },
        widgetSetting: {
            size: {
                x: 2,
                y: 2
            },
            position: {
                row: 0,
                col: 0
            }
        }
      });

      if(data){
        _.extend(this, data);
      }
    }

    CustomChart.prototype.getWidgetSetting = function(){
      return this.widgetSetting;
    }

    CustomChart.prototype.update = function(){
      return CustomChartsService.updateChart(this);
    };

    CustomChart.prototype.remove = function(){
      return CustomChartsService.deleteChart(this);
    };

    CustomChart.prototype.save = function(){
      if(!this.id){
        this.id = guid();
        return CustomChartsService.addChart(this);
      }else{
        return this.update();
      }
    };

    CustomChart.factory = function(data){
      var _data = {name: '新建图表'};
      if(data){
        _.extend(_data, data);
      }
      return new CustomChart(_data);
    };

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    };

    CustomChartsService.customChartMap = {
        sizeX: 'chart.getWidgetSetting().size.x',
        sizeY: 'chart.getWidgetSetting().size.y',
        row: 'chart.getWidgetSetting().position.row',
        col: 'chart.getWidgetSetting().position.col'
    };


    CustomChartsService.gridsterOpts = {
      columns: 6, // the width of the grid, in columns
      pushing: true, // whether to push other items out of the way on move or resize
      floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
      swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
      width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
      colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
      rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
      margins: [10, 10], // the pixel distance between each widget
      outerMargin: true, // whether margins apply to outer edges of the grid
      isMobile: false, // stacks the grid items if true
      mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
      mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      minColumns: 1, // the minimum columns the grid must have
      minRows: 1, // the minimum height of the grid, in rows
      maxRows: 100,
      defaultSizeX: 2, // the default width of a gridster item, if not specifed
      defaultSizeY: 1, // the default height of a gridster item, if not specified
      minSizeX: 1, // minimum column width of an item
      maxSizeX: null, // maximum column width of an item
      minSizeY: 1, // minumum row height of an item
      maxSizeY: null, // maximum row height of an item
      resizable: {
          enabled: true,
          handles: ['e', 'w', 's', 'se', 'sw', 'ne', 'nw'],
          start: function(event, $element, widget) {}, // optional callback fired when resize is started,
          resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
          stop: function(event, $element, widget) {
              AppUtils.preventLoading();
              var chart = $($element).scope().$parent.chart;
              if(chart.id)
                chart.update();
          } // optional callback fired when item is finished resizing
      },
      draggable: {
          enabled: true, // whether dragging items is supported
          //handle: '.my-class', // optional selector for resize handle
          start: function(event, $element, widget) {}, // optional callback fired when drag is started,
          drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
          stop: function(event, $element, widget) {
              AppUtils.preventLoading();
              var chart = $($element).scope().$parent.chart;
              if(chart.id)
                chart.update();
          } // optional callback fired when item is finished dragging
      }
    };

    return CustomChartsService;
  }]);