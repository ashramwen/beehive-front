angular.module('BeehivePortal')
  .factory('CustomChartsService', ['$q', '$timeout', '$$User', 'AppUtils', 'ReportingService', function($q, $timeout, $$User, AppUtils, ReportingService){
    var CHART_ID_FIELD_NAME = 'KII_CHART';

    var _chartIDs = [];

    var CustomChartsService = {
      charts: [],
      refresh: function(){
        var $defer = $q.defer();

        $$User.getCustomData({name: CHART_ID_FIELD_NAME}, function(response){
          if(!response) return;
          _chartIDs = response.dataset || [];

          var quries = _.map(_chartIDs, function(id){
            return CustomChartsService.getChart(id);
          });

          $q.all(quries).then(function(charts){
            CustomChartsService.charts = charts;
            CustomChartsService.charts = _.map(CustomChartsService.charts, function(chartData){
              return new CustomChart(chartData.dataset);
            });
            CustomChartsService.charts = CustomChartsService.charts || [];
            $defer.resolve(CustomChartsService.charts);
          });

        });

        return $defer.promise;
      },
      update: function(){
        return $$User.setCustomData({}, {name: CHART_ID_FIELD_NAME, dataset: _chartIDs}).$promise;
      },
      getChart: function(id){
        return $$User.getCustomData({name: id}).$promise;
      },
      addChart: function(chart){
        var id = chart.id;
        _chartIDs.push(chart.id);

        var _chart = AppUtils.clone(chart);

        if(_chart['period']){
          delete _chart['period'];
        }

        CustomChartsService.update();

        return $$User.setCustomData({name: id, dataset: _chart}).$promise;
      },
      updateChart: function(chart){
        var id = chart.id;
        var _chart = AppUtils.clone(chart);

        if(_chart['period']){
          delete _chart['period'];
        }

        return $$User.setCustomData({name: id, dataset: _chart}).$promise;
      },
      deleteChart: function(chart){
        var id = chart.id;
        _chartIDs.remove(chart.id);
        CustomChartsService.update();
        return $$User.setCustomData({name: id}).$promise;
      },
      refreshChart: function(id){
        return $$User.getCustomData({name: id}, function(data){
          var index = _.findIndex(CustomChartsService.charts, {id: id});
          CustomChartsService.charts[index] = new CustomChart(data);
        }).$promise;
      },
      CustomChart: CustomChart,
      factoryChart: function(){
        var chart = CustomChart.factory();
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
          timeUnit: 'H'
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

      this.period = new KiiReporting.KiiTimePeriod(null);
      this.period.setUnit(this.options.timeUnit);
      this.period.setInterval(this.options.interval);

      var fromTime = new Date();
      var toTime = new Date();
      fromTime.setDate(fromTime.getDate() - 1);

      this.period.setFromTime(fromTime);
      this.period.setToTime(toTime);
    }

    CustomChart.prototype.setPeriod = function(period){
      this.period.setFromTime(period.from);
      this.period.setToTime(period.to);
    };

    CustomChart.prototype.refresh = function(){
      this.period.setUnit(this.options.timeUnit);
      this.period.setInterval(this.options.interval);
      if(this.refreshChart){
        this.refreshChart();
      }
    };

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

    CustomChartsService.buildQueryFromOptions = function(options){
      var $defer = $q.defer();

      ReportingService.getLocationThings(options.type.typeName, options.locations).then(function(locations){
        var allThings = ReportingService.getAllThings(locations);
        var enumObj = ReportingService.getLocationEnums(locations);

        var filter = {
          "filtered": {
            "query": {
              "query_string": {
                "query": "*",
                "analyze_wildcard": true
              }
            },
            "filter": {
              "bool": {
                "must": [
                  {
                    "terms" : { 
                      "target" : allThings
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        };

        var rootAggs = {};
        var aggs = rootAggs;
        if(options.dimensions.time){
          _.extend(aggs, {
            "aggs":{
              "byTime": {
                "_kii_agg_field_name": "日期",
                "_kii_agg_chart": options.chartType,
                "date_histogram": {
                  "field": "date",
                  "interval": options.interval + options.timeUnit
                }
              }
            }
          });
          aggs = aggs.aggs.byTime;
        }
        if(options.dimensions.location){
          _.extend(aggs, {
            "aggs":{
              "byLocation": {
                "_kii_agg_field_name": "位置",
                "_kii_agg_chart": options.chartType,
                "enum": enumObj
              }
            }
          });
          aggs = aggs.aggs.byLocation;
        }

        _.extend(aggs, {
          "aggs": {
            "CALC": {
              "_kii_agg_field_name": options.property.displayName
            }
          }
        });

        aggs.aggs.CALC[options.aggMethod] = {
          "field": options.property.propertyName
        };

        var result = {
          "_kii_agg_name": options.name,
          "_kii_query_path": '/' + options.index + '/_search',
          "query": filter,
          "size": 0,
          "aggs": null,
        };

        _.extend(result, rootAggs);

        $defer.resolve(result);
      });
      return $defer.promise;
    };

    return CustomChartsService;
  }])
  .factory('EditChartService', ['$$Type', 'TriggerDetailService', '$q', function($$Type, TriggerDetailService, $q){
    var EditChartService = {};

    // get type and properties accordingly
    EditChartService.getAllTypes = function(){
      var $defer = $q.defer();

      var typeOptions = [];
      $$Type.getAll(function(types){
        var schemaQueries = [];

        _.each(types, function(type){
          var $promise = $$Type.getSchema({type: type.type}).$promise;
          schemaQueries.push($promise);
        });

        $q.all(schemaQueries).then(function(schemas){
          _.each(schemas, function(schema, i){
            schema = TriggerDetailService.parseSchema(schema);

            typeOptions.push({
              text: schema.displayName,
              value: types[i].type,
              properties: schema.properties
            });
          });
          $defer.resolve(typeOptions);
        });
      });

      return $defer.promise;
    };

    return EditChartService;
  }]);