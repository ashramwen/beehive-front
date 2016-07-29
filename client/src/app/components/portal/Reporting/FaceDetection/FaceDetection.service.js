angular.module('BeehivePortal')
  .factory('FaceDetectionService', ['$q', '$timeout', function($q, $timeout){
    var FaceDetectionService = {};

    FaceDetectionService.ganzhiSample =
    {
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
                    "id" : [45650,32159,24001,67962,1484,63412,6360,89901,43668,60765]
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
              "_kii_agg_chart": "line",
              "aggs": {
                  "byLocation": {
                      "_kii_agg_chart": "pie",
                      "_kii_agg_field_name": "楼层号",
                      "enum": {
                        "keys": ["1楼","2楼","3楼"],
                        "field": "id",
                        "values": [
                          [45650,32159,24001],
                          [67962,1484,63412,6360],
                          [89901,43668,60765]
                        ]
                      },
                      "aggs": {
                          "ganzhiRate": {
                              "enum": {
                                  "keys": ["detectedT", "detectedF"],
                                  "field": "detected",
                                  "values": [
                                      [true],
                                      [false]
                                  ]
                              },
                              "aggs":{
                                  "count": {
                                      "value_count": {
                                          "field": "id"
                                      }
                                  }
                              }
                          },
                          "rate": {
                            "_kii_agg_field_name": "空间占用率",
                            "script": "doc.ganzhiRate.detectedT.count/(doc.ganzhiRate.detectedT.count + doc.ganzhiRate.detectedF.count)"
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

    FaceDetectionService.ganzhiGroupSample = {
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
                    "id" : [45650,32159,24001,67962,1484,63412,6360,89901,43668,60765]
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
              "_kii_agg_chart": "line",
              "aggs": {
                "ganzhiRate": {
                    "enum": {
                        "keys": ["detectedT", "detectedF"],
                        "field": "detected",
                        "values": [
                            [true],
                            [false]
                        ]
                    },
                    "aggs":{
                        "count": {
                            "value_count": {
                                "field": "id"
                            }
                        }
                    }
                },
                "rate": {
                  "_kii_agg_field_name": "空间占用率",
                  "script": "doc.ganzhiRate.detectedT.count/(doc.ganzhiRate.detectedT.count + doc.ganzhiRate.detectedF.count)"
                }
              },
              "date_histogram": {
                  "field": "date",
                  "interval": "hour"
              }
            }
        }
    };


    FaceDetectionService.ganzhiByLocSample =
    {
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
                    "id" : [45650,32159,24001,67962,1484,63412,6360,89901,43668,60765]
                  }
                },
                {
                  "term": {
                     "detected": true
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
              "_kii_agg_field_name": "楼层号",
              "enum": {
                "keys": ["1楼","2楼","3楼"],
                "field": "id",
                "values": [
                  [45650,32159,24001],
                  [67962,1484,63412,6360],
                  [89901,43668,60765]
                ]
              },
              "aggs": {
                  "count": {
                    "_kii_agg_field_name": "人气值",
                    "value_count": {
                      "field": "id"
                    }
                  }
              }
          }
              
        }
    };

    FaceDetectionService.summaryQuery = {
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
                    "id" : [45650,32159,24001,67962,1484,63412,6360,89901,43668,60765]
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
        "Detected": {
          "_kii_agg_chart": "pie",
          "enum": {
            "keys": ['已使用空间', '未使用空间'],
            "field": "detected",
            "values": [
              [true],
              [false]
            ]
          },
          "aggs":{
            "countT": {
              "_kii_agg_field_name": '人气值',
              "value_count": {
                "field": "id"
              }
            }
          }
        }
      }
    };
          



    return FaceDetectionService;
  }]);