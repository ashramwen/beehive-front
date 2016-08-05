'use strict';

angular.module('BeehivePortal')
  .factory('ConditionTriggerDetailService',['$rootScope', '$$Type', '$q' , '$$Thing', function($rootScope, $$Type, $q, $$Thing) {
    var ConditionTriggerDetailService = {};

    ConditionTriggerDetailService.example = {
      "type" : "Summary",
      "prepareCondition":{
        "Type":"simple",
        "startAt":100,
        "endAt":101
      },
      "predicate" : {
        "triggersWhen" : "CONDITION_TRUE",
        "schedule": {
          "cron":"1 1 1 * *  ?",
          "type":"Cron"
        },
        "condition" : {
          "clauses" : [ {
            "field" : "Sensor.Bri",
            "upperLimit" : 50,
            "upperIncluded" : false,
            "lowerIncluded" : false,
            "type" : "range"
          }],
          "type" : "or"
        }
      },
      "targets" : [ {
        "command" : {
          "actions" : [ {
            "turnPower" : {
              "Power" : 1
            }
          } ],
          "schemaVersion" : 0,
          "metadata" : {
            "type": 'Lighting'
          }
        },
        "thingList": [1135, 1139]
      } ],
      "summarySource" : {
        "Sensor": {
          "source": {
            "thingList" : [1134]
          },
          "expressList": [
            {stateName: "Bri", function: "", "summaryAlias": "Bri"}
          ]
        }
      },
      "policy" : {
        "groupPolicy" : "Percent",
        "criticalNumber" : 100
      }
    };



    return ConditionTriggerDetailService;
  }
]);