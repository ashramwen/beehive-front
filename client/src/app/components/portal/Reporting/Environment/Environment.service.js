angular.module('BeehivePortal')
  .factory('EnvironmentService', ['$q', '$timeout', '$http', 'ReportingService', function($q, $timeout, $http, ReportingService){
    var EnvironmentService = {};

    EnvironmentService.getEnvironmentQuery = function(agg, fieldName, displayName, byTime, split, subLevels){
      
      var allThings = ReportingService.getAllThings(subLevels);
      var enumObj = ReportingService.getLocationEnums(subLevels);

      var query = {
        "_kii_agg_name": "环境数据",
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
                            /*
                            "CALC": {
                                "aggs": {
                                    "AVG": {
                                        "avg": {
                                            "field": 'state.' + fieldName
                                        }
                                    }
                                },
                                "date_histogram": {
                                    "field": "state.date",
                                    "interval": "1m"
                                }
                            },
                            */
                            "AGG": {
                                "avg": {
                                    "field": 'state.' + fieldName
                                },
                                "_kii_agg_field_name": displayName,
                                "_kii_selected": true
                            }
                        }
                    },
                    /*
                    "CALC": {
                        "aggs": {
                            "AVG": {
                                "avg": {
                                    "field": 'state.' + fieldName
                                }
                            }
                        },
                        "date_histogram": {
                            "field": "state.date",
                            "interval": "1m"
                        }
                    },
                    */
                    "AGG": {
                        "_kii_agg_field_name": displayName,
                        "_kii_selected": true,
                        "avg": {
                            "field": 'state.' + fieldName
                        }
                    }
                },
                "date_histogram": {
                    "field": "state.date",
                    "interval": "hour"
                }
            }
          }
      };

      /*
      query.aggs.byTime.aggs.AGG[agg + '_bucket'] = {
        "buckets_path": "CALC>AVG"
      };

      query.aggs.byTime.aggs.byLocation.aggs.AGG[agg + '_bucket'] = {
        "buckets_path": "CALC>AVG"
      };
      */

      query = _.clone(query);

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


    EnvironmentService.getSummaryData = function(fieldName, subLevels){
      
      var allThings = ReportingService.getAllThings(subLevels);

      var $defer = $q.defer();
      var query = {
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
                      "range": {
                        "state.date": {
                          "gte": 0,
                          "lte": 7258118400000,
                          "format": "epoch_millis"
                        }
                      }
                    },
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
        "size": 1,
        "sort": [
          {
            "state.date": {
              "order": "desc"
            }
          }
        ]
      };

      var kiiQueryConfig = KiiReporting.KiiQueryConfig.getConfig();
      $http({
        method: 'POST',
        data: query,
        url: KiiReporting.KiiQueryConfig.getConfig().getBaseUrl() + "/" + AppConfig.kiiAppID +  '/_search',
        headers: {"Authorization": kiiQueryConfig.getToken()}
      }).then(function(response){
        $defer.resolve(response.data.hits.hits[0]['_source']['state'][fieldName]);
        console.log(response);
      });
      return $defer.promise;
    };



    return EnvironmentService;
  }]);