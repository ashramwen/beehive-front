angular.module('BeehivePortal').factory('CodeExampleService', [function(){
  var CodeExampleService = {};

  CodeExampleService.lineChartExample = {
      "_kii_agg_name": "二氧化碳",
      "_kii_query_path": "/192b49ce/_search",
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
                             "script" : {
                               "script": "_source.state != null && _source.state.date && new Date(_source.state.date).getHours()>20;"
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
                      "@injection": "location",
                      /*
                      "enum": {
                          "values": [
                              [
                                  "th.f83120e36100-870b-6e11-7a47-0e7e54bb"
                              ],
                              [
                                  "th.f83120e36100-870b-6e11-7a47-02fa42cb"
                              ]
                          ],
                          "keys": [
                              "M01区块",
                              "M02区块"
                          ],
                          "field": "state.target"
                      },
                      */
                      "aggs": {
                          "byThing": {
                              "terms": {
                                  "field": "state.target"
                              },
                              "aggs": {
                                  "KwhMax": {
                                      "max": {
                                          "field": "state.Kwh"
                                      }
                                  },
                                  "KwhMin": {
                                      "min": {
                                          "field": "state.Kwh"
                                      }
                                  }
                              }
                          },
                          "KwnD": {
                              "_kii_agg_field_name": "电量消耗",
                              "script": "doc['totalMaxConsume'] - doc['totalMinConsume']",
                              "_kii_selected": true
                          },
                          "totalMaxConsume": {
                              "sum_bucket": {
                                  "buckets_path": "byThing>KwhMax"
                              }
                          },
                          "totalMinConsume": {
                              "sum_bucket": {
                                  "buckets_path": "byThing>KwhMin"
                              }
                          }
                      }
                  },
                  "byThing": {
                      "terms": {
                          "field": "state.target"
                      },
                      "aggs": {
                          "KwhMax": {
                              "max": {
                                  "field": "state.Kwh"
                              }
                          },
                          "KwhMin": {
                              "min": {
                                  "field": "state.Kwh"
                              }
                          }
                      }
                  },
                  "KwnD": {
                      "_kii_agg_field_name": "电量消耗",
                      "script": "doc['totalMaxConsume'] - doc['totalMinConsume']",
                      "_kii_selected": true
                  },
                  "totalMaxConsume": {
                      "sum_bucket": {
                          "buckets_path": "byThing>KwhMax"
                      }
                  },
                  "totalMinConsume": {
                      "sum_bucket": {
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
  };


}]);