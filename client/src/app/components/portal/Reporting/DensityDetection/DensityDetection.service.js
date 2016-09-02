angular.module('BeehivePortal')
  .factory('DensityDetectionService', ['$q', '$timeout', 'AppUtils', 'ReportingService', function($q, $timeout, AppUtils, ReportingService){
    var DensityDetectionService = {};

    var detectedByTimeLocation = 
    {
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
                    "state.target" : [1300,1301,1302,1303,1304,1305,1306,1307,1308]
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
              "_kii_agg_chart": "line",
              "aggs": {
                  "byLocation": {
                      "_kii_agg_chart": "pie",
                      "_kii_agg_field_name": "楼层号",
                      "enum": {
                        "keys": ["1楼","2楼","3楼"],
                        "field": "state.target",
                        "values": [
                          [1300,1301,1302],
                          [1303,1304,1305],
                          [1306,1307,1308]
                        ]
                      },
                      "aggs": {
                          "ganzhiRate": {
                              "enum": {
                                  "keys": ["detectedT", "detectedF"],
                                  "field": "state.PIR",
                                  "values": [
                                      [1],
                                      [0]
                                  ]
                              },
                              "aggs":{
                                  "count": {
                                      "value_count": {
                                          "field": "state.target"
                                      }
                                  }
                              }
                          },
                          "rate": {
                            "_kii_agg_field_name": "空间占用率",
                            "script": "doc.ganzhiRate.detectedT.count/(doc.ganzhiRate.detectedT.count + doc.ganzhiRate.detectedF.count)"
                          },
                          "value": {
                            "_kii_agg_field_name": "人气值",
                            "script": "doc.ganzhiRate.detectedT.count"
                          }
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

    var detectedByTime = {
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
                    "state.target" : [45650,32159,24001,67962,1484,63412,6360,89901,43668,60765]
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
              "_kii_agg_chart": "line",
              "aggs": {
                "ganzhiRate": {
                    "enum": {
                        "keys": ["detectedT", "detectedF"],
                        "field": "state.PIR",
                        "values": [
                            [1],
                            [0]
                        ]
                    },
                    "aggs":{
                        "count": {
                            "value_count": {
                                "field": "state.target"
                            }
                        }
                    }
                },
                "rate": {
                  "_kii_agg_field_name": "空间占用率",
                  "script": "doc.ganzhiRate.detectedT.count/(doc.ganzhiRate.detectedT.count + doc.ganzhiRate.detectedF.count)"
                },
                "value": {
                  "_kii_agg_field_name": "人气值",
                  "script": "doc.ganzhiRate.detectedT.count"
                }
              },
              "date_histogram": {
                  "field": "state.date",
                  "interval": "hour"
              }
            }
        }
    };


    var detectedByLocation =
    {
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
                      "state.target" : [45650,32159,24001,67962,1484,63412,6360,89901,43668,60765]
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
                "_kii_agg_field_name": "位置",
                "enum": {
                  "keys": ["1楼","2楼","3楼"],
                  "field": "state.target",
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
                            "field": "state.PIR",
                            "values": [
                                [1],
                                [0]
                            ]
                        },
                        "aggs":{
                            "count": {
                                "value_count": {
                                    "field": "state.target"
                                }
                            }
                        }
                    },
                    "rate": {
                      "_kii_agg_field_name": "空间占用率",
                      "script": "doc.ganzhiRate.detectedT.count/(doc.ganzhiRate.detectedT.count + doc.ganzhiRate.detectedF.count)"
                    },
                    "value": {
                      "_kii_agg_field_name": "人气值",
                      "script": "doc.ganzhiRate.detectedT.count"
                    }
                }
            }
                
        }
    };

    var summaryQuery = {
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
                    "state.target" : [45650,32159,24001,67962,1484,63412,6360,89901,43668,60765]
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
            "field": "state.PIR",
            "values": [
              [1],
              [0]
            ]
          },
          "aggs":{
            "countT": {
              "_kii_agg_field_name": '人气值',
              "value_count": {
                "field": "state.target"
              }
            }
          }
        }
      }
    };


    DensityDetectionService.generateLineQuery = function(split, source, subLevels){
      var query = split? detectedByTimeLocation: detectedByTime;
      query = AppUtils.clone(query);

      var aggObj;
      var allThings = ReportingService.getAllThings(subLevels);
      var terms = query.query.filtered.filter.bool.must[0].terms;

      if(split){
        var enumObj = ReportingService.getLocationEnums(subLevels);
        var locationObj = query.aggs.byTime.aggs.byLocation;
        _.extend(locationObj.enum, enumObj);

        aggObj = query.aggs.byTime.aggs.byLocation.aggs;
      }else{
        aggObj = query.aggs.byTime.aggs;
      }

      terms['state.target'] = allThings;
      

      if(split){
        if(source == 'rate'){
          delete aggObj.value;
        }else{
          delete aggObj.rate;
        }
      }else{
        if(source == 'rate'){
          delete aggObj.value;
        }else{
          delete aggObj.rate;
        }
      }
      
      return query;
    };

    DensityDetectionService.generateBarQuery = function(source, subLevels){
      var allThings = ReportingService.getAllThings(subLevels);
      var enumObj = ReportingService.getLocationEnums(subLevels);

      var query = AppUtils.clone(detectedByLocation);
      var terms = query.query.filtered.filter.bool.must[0].terms;
      var locationObj = query.aggs.byLocation;

      terms['state.target'] = allThings;
      _.extend(locationObj.enum, enumObj); 

      if(source == 'rate'){
        delete query.aggs.byLocation.aggs.value;
      }else{
        delete query.aggs.byLocation.aggs.rate;
      }

      return query;
    };

    DensityDetectionService.generatePieQuery = function(subLevels){
      var query = AppUtils.clone(detectedByLocation);

      var allThings = ReportingService.getAllThings(subLevels);
      var enumObj = ReportingService.getLocationEnums(subLevels);

      var query = AppUtils.clone(detectedByLocation);
      var terms = query.query.filtered.filter.bool.must[0].terms;
      var locationObj = query.aggs.byLocation;


      terms['state.target'] = allThings;
      _.extend(locationObj.enum, enumObj); 

      delete query.aggs.byLocation.aggs.rate;

      return query;
    };

    DensityDetectionService.generateSummaryQuery = function(subLevels){
      var query = AppUtils.clone(summaryQuery);

      var allThings = ReportingService.getAllThings(subLevels);
      var terms = query.query.filtered.filter.bool.must[0].terms;

      terms['state.target'] = allThings;

      return query;
    };

    


    return DensityDetectionService;
  }]);