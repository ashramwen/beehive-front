angular.module('BeehivePortal')
  .factory('ElectricityService', ['$q', '$timeout', '$http', 'ReportingService', 'AppUtils', function($q, $timeout, $http, ReportingService, AppUtils){
    var ElectricityService = {};

    ElectricityService.generateConsumption = function(byTime, split, subLevels){
      var allThings = ReportingService.getAllThings(subLevels);
      var enumObj = ReportingService.getLocationEnums(subLevels);

      var query = AppUtils.clone({
        "_kii_agg_name": "电表",
        "_kii_query_path": "/" + AppConfig.kiiAppID + "/_search",
        "query": {
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
                      "state.target" : allThings
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        },
        "size": 0,
        "aggs": {
            "byTime": {
                "_kii_agg_field_name": "日期",
                "aggs": {
                    "byLocation": {
                      "_kii_agg_chart": "bar",
                      "_kii_agg_field_name": "楼层",
                      "enum": enumObj,
                      "aggs": {
                        "byThing":{
                          "terms":{
                            "field": "state.target"
                          },
                          "aggs": {
                            "KwhMax":{
                              "max": {
                                "field": "state.Wh"
                              }
                            },
                            "KwhMin":{
                              "min": {
                                "field": "state.Wh"
                              }
                            }
                          }
                        },
                        "KwnD": {
                          "_kii_agg_field_name": "电量消耗",
                          "script": "doc['totalMaxConsume'] - doc['totalMinConsume']",
                          "_kii_selected": true
                        },
                        "totalMaxConsume":{
                          "sum_bucket":{
                              "buckets_path": "byThing>KwhMax"
                          }
                        },
                        "totalMinConsume":{
                          "sum_bucket":{
                              "buckets_path": "byThing>KwhMin"
                          }
                        }
                      }
                    },
                    "byThing":{
                      "terms":{
                        "field": "state.target"
                      },
                      "aggs": {
                        "KwhMax":{
                          "max": {
                            "field": "state.Wh"
                          }
                        },
                        "KwhMin":{
                          "min": {
                            "field": "state.Wh"
                          }
                        }
                      }
                    },
                    "KwnD": {
                      "_kii_agg_field_name": "电量消耗",
                      "script": "doc['totalMaxConsume'] - doc['totalMinConsume']",
                      "_kii_selected": true
                    },
                    "totalMaxConsume":{
                      "sum_bucket":{
                          "buckets_path": "byThing>KwhMax"
                      }
                    },
                    "totalMinConsume":{
                      "sum_bucket":{
                          "buckets_path": "byThing>KwhMin"
                      }
                    }
                },
                "date_histogram": {
                    "field": "state.date",
                    "interval": "hour"
                }
            }
        }
      });

      if(!byTime){
        query.aggs.byLocation = query.aggs.byTime.aggs.byLocation;
        delete query.aggs.byTime;
      }else{
        if(!split){
          delete query.aggs.byTime.aggs.byLocation;
        }
      }

      return query;
    };

    ElectricityService.getConsumeSummary = function(timePeriod, subLevels){
      var allThings = ReportingService.getAllThings(subLevels);
      var enumObj = ReportingService.getLocationEnums(subLevels);

      var query = AppUtils.clone({
        "_kii_agg_name": "测试数据",
        "_kii_query_path": "/" + AppConfig.kiiAppID + "/_search",
        "query": {
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
                      "state.target" : allThings
                    }
                  }
                ],
                "must_not": []
              }
            }
          }
        },
        "size": 0,
        "aggs":{
          "MaxKwh": {
            "max": {
              "field": "state.Wh"
            }
          },
          "MinKwh": {
            "min": {
              "field": "state.Wh"
            }
          }
        }
      });

      var $defer = $q.defer();

      var kiiQuery = new KiiReporting.KiiQuery(JSON.stringify(query));
      kiiQuery.setTimePeriod(timePeriod);
      kiiQuery.query();
      kiiQuery.subscribe(function(data){
        var result = data.summary.MaxKwh - data.summary.MinKwh;
        $defer.resolve(result);
      });

      return $defer.promise;
    };

    return ElectricityService;
  }]);