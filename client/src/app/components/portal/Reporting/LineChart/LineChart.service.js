angular.module('BeehivePortal')
  .factory('LineChartService', ['$q', '$timeout', function($q, $timeout){
    var LineChartService = {};

    var lineQuery = {
      "_kii_agg_name": "测试数据",
      "_kii_query_path": "/reporting/_search",
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
                    "date": {
                      "gte": 0,
                      "lte": 1562120800000,
                      "format": "epoch_millis"
                    }
                  }
                },
                {
                  "terms" : { 
                    "id" : [44926,63349,79191,27876,77666,47103,34346,18999,10045,17544]
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
          "byHour": {
              "_kii_agg_field_name": "日期",
              "aggs": {
                  "byLocation": {
                    "_kii_agg_chart": "bar",
                    "_kii_agg_field_name": "楼层",
                    "enum": {
                      "keys": ['1楼','2楼','3楼'],
                      "field": "id",
                      "values": [
                        [18999,10045,17544],
                        [34346,47103,77666],
                        [27876,79191,63349,44926]
                      ]
                    },
                    "aggs": {
                      "byThing":{
                        "terms":{
                          "field": "id"
                        },
                        "aggs": {
                          "KwhMax":{
                            "max": {
                              "field": "Kwh"
                            }
                          },
                          "KwhMin":{
                            "min": {
                              "field": "Kwh"
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
                  }
              },
              "date_histogram": {
                  "field": "date",
                  "interval": "hour"
              }
          }
      }
    };

    var lineGroupQuery = {
      "_kii_agg_name": "测试数据",
      "_kii_query_path": "/reporting/_search",
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
                    "date": {
                      "gte": 0,
                      "lte": 1562120800000,
                      "format": "epoch_millis"
                    }
                  }
                },
                {
                  "terms" : { 
                    "id" : [44926,63349,79191,27876,77666,47103,34346,18999,10045,17544]
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
          "byHour": {
              "_kii_agg_field_name": "日期",
              "aggs": {
                "byThing":{
                  "terms":{
                    "field": "id"
                  },
                  "aggs": {
                    "KwhMax":{
                      "max": {
                        "field": "Kwh"
                      }
                    },
                    "KwhMin":{
                      "min": {
                        "field": "Kwh"
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
                "field": "date",
                "interval": "hour"
            }
          }
      }
    };

    var barQuery = {
      "_kii_agg_name": "测试数据",
      "_kii_query_path": "/reporting/_search",
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
                    "date": {
                      "gte": 0,
                      "lte": 1562120800000,
                      "format": "epoch_millis"
                    }
                  }
                },
                {
                  "terms" : { 
                    "id" : [44926,63349,79191,27876,77666,47103,34346,18999,10045,17544]
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
        "byLocation": {
          "_kii_agg_chart": "bar",
          "_kii_agg_field_name": "楼层",
          "enum": {
            "keys": ["1楼","2楼","3楼"],
            "field": "id",
            "values": [
              [18999,10045,17544],
              [34346,47103,77666],
              [27876,79191,63349,44926]
            ]
          },
          "aggs": {
            "byThing":{
              "terms":{
                "field": "id"
              },
              "aggs": {
                "KwhMax":{
                  "max": {
                    "field": "Kwh"
                  }
                },
                "KwhMin":{
                  "min": {
                    "field": "Kwh"
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
        "MaxKwh": {
          "max": {
            "field": "Kwh"
          }
        },
        "MinKwh": {
          "min": {
            "field": "Kwh"
          }
        }
      }
    };


    LineChartService.getQuery = function () {
      var $defer = $q.defer();

      $timeout(function() {
        $defer.resolve({
          barQuery: barQuery,
          lineQuery: lineQuery,
          lineGroupQuery: lineGroupQuery
        });
      })

      return $defer.promise;
    };


    return LineChartService;
  }]);