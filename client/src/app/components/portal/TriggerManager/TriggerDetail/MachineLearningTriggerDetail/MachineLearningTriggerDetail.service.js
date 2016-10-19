'use strict';

angular.module('BeehivePortal')
  .factory('MachineLearningTriggerDetailService',['$rootScope', '$$Type', '$q' , '$$Thing', 'TriggerDetailService', '$cacheFactory', '$$MechineLearning', 'ConditionTriggerDetailService', '$$Trigger', function($rootScope, $$Type, $q, $$Thing, TriggerDetailService, $cacheFactory, $$MechineLearning, ConditionTriggerDetailService, $$Trigger) {
    var MachineLearningTriggerDetailService = {};

    MachineLearningTriggerDetailService.dataValidation = function(triggerData){
      if(!triggerData.conditionGroups || !triggerData.conditionGroups.length){
        throw(new Error());
      }
      if(_.isEmpty(triggerData.name)){
        throw(new Error());
      }
      if(!triggerData.actionGroups || !triggerData.actionGroups.length){
        throw(new Error);
      }
      if(triggerData.timeSpan.startAt && triggerData.timeSpan.endAt){
        if(triggerData.timeSpan.endAt <= triggerData.timeSpan.startAt){
          throw(new Error);
        }
      }
      if(!triggerData.location || triggerData.location.length!=9){
        throw(new Error('no room is given'));
      }
      if(!triggerData.model.properties.length){
        throw(new Error('at least one ml properties'));
      }else{
        var errorFlag = false;
        _.each(triggerData.model.properties, function(property){
          errorFlag = errorFlag || _.isUndefined(property.value) || _.isNull(property.value);
        });
        if(errorFlag) throw(new Error('empty input'))
      }
      return true;
    };

    MachineLearningTriggerDetailService.createVirtualThing = function(type){
      var $defer = $q.defer();

      var thing = {
          vendorThingID: MachineLearningTriggerDetailService.generateVendorThingID(),
          type: type,
          kiiAppID: AppConfig.kiiAppID
      };

      $$Thing.save(thing, function(result){
        thing.globalThingID = result.globalThingID;
        $$Thing.onboard(thing, function(){
          $$Thing.get(thing, function(onboardingInfo){
            _.extend(thing, onboardingInfo);
            $defer.resolve(thing);
          });
        });
      }, function(err){
        $defer.reject(err);
      });

      return $defer.promise;
    };

    MachineLearningTriggerDetailService.generateVendorThingID = function(){
      return ~~(Math.random() * 9000 + 1000) + 'Z-Z' + ~~(Math.random() * 90 + 10) + '-Y-' + ~~(Math.random() * 900 + 100);
    };

    MachineLearningTriggerDetailService.generateTrigger = function(triggerData){
      var $defer = $q.defer();

      var dataset2 = ConditionTriggerDetailService.generateSourcesAndConditions({
        any: 'or',
        conditionGroups: [{
          properties: triggerData.model.properties,
          things: [{globalThingID: triggerData.thingID}],
          type: 'ROOM_LIGHT',
          id: 'ROOM_LIGHT'
        }]
      });

      var trigger2 = {
        "name": 'target_' + triggerData.name,
        "description": triggerData.description,
        "type": "Summary",
        "predicate": {
          "triggersWhen": triggerData.triggersWhen,
          "condition": dataset2.condition
        },
        "summarySource": dataset2.sources,
        "targets": TriggerDetailService.generateTargets(triggerData)
      };
      

      _.each(trigger2.predicate.condition.clauses, function(clause){
        clause.clauses.push(clause.clauses[0]);
      });

      trigger2.predicate.condition.clauses.push(trigger2.predicate.condition.clauses[0]);

      $$Trigger.save(trigger2, function(sourceTrigger){
        triggerData = angular.copy(triggerData);
        triggerData.sourceTriggerID = sourceTrigger.triggerID;
        triggerData.description = MachineLearningTriggerDetailService.generateDescription(triggerData);

        var dataset = ConditionTriggerDetailService.generateSourcesAndConditions(triggerData);

        var trigger = {
          "name": triggerData.name,
          "description": triggerData.description,
          "type": "Summary",
          "predicate": {
            "triggersWhen" : triggerData.triggersWhen,
            "condition": dataset.condition
          },
          "prepareCondition": TriggerDetailService.generatePrepareCondition(triggerData),
          "summarySource": dataset.sources,
          "targets": [
            {
              "url": "http://114.215.178.24:8082/beehive-ml/ml/model/" + triggerData.taskID + "/predict",
              "contentType": "application/json",
              "method": "GET",
              "authorization": "Basic YWRtaW46YWRtaW4=",
              "type": "HttpApiCall"
            }
          ]
        };

        _.each(trigger.predicate.condition.clauses, function(clause){
          clause.clauses.push(clause.clauses[0]);
        });

        trigger.predicate.condition.clauses.push(trigger.predicate.condition.clauses[0]);

        $defer.resolve(trigger);
      }, function(err){
        $defer.reject(err);
      });

      return $defer.promise;
    };

    MachineLearningTriggerDetailService.parseTrigger = function(triggerData){
      var data = MachineLearningTriggerDetailService.parseDescription(triggerData.description);
      triggerData.taskID = data.taskID;
      triggerData.location = triggerData.location || data.location;
      triggerData.thingID = data.thingID;
      triggerData.conditionGroups = _.reject(triggerData.conditionGroups, {id: 'ROOM_LIGHT'});
      triggerData.sourceTriggerID = data.sourceTriggerID;
      if(!triggerData.actionGroups || !triggerData.actionGroups.length){
        triggerData.actionGroups =  data.actionGroups;
      }
      triggerData.model = triggerData.model || data.model;
      console.log(triggerData.conditionGroups);
    };


    /**
     * {taskID: String, type: String, thingID: String, location: String}
     * @param  {[type]} description [description]
     * @return {[type]}             [description]
     */
    MachineLearningTriggerDetailService.parseDescription = function(description){
      if(!description) return {};
      return JSON.parse(description);
    };


    /**
     * produce trigger data
     * @param  {[type]} triggerData [description]
     * @return {[type]}             [description]
     */
    MachineLearningTriggerDetailService.generateDescription = function(triggerData){

      var description = {
        taskID: triggerData.taskID,
        type: 'MachineLearning',
        thingID: triggerData.thingID,
        location: triggerData.location,
        model: triggerData.model,
        actionGroups: triggerData.actionGroups,
        sourceTriggerID: triggerData.sourceTriggerID
      };

      return JSON.stringify(description);
    };

    MachineLearningTriggerDetailService.createMLTask = function(vendorThingID, location){
      var $defer = $q.defer();

      $$MechineLearning.createTask({
        virtualThingId: vendorThingID,
        roomNum: location
      }, function(task){
        MachineLearningTriggerDetailService.enableTask(task.taskID).then(function(){
          $defer.resolve(task.taskID);
        }, function(err){
          $defer.reject(err);
        });
      }, function(err){
        $defer.reject(err);
      });

      return $defer.promise;
    };

    MachineLearningTriggerDetailService.enableTask = function(taskID){
      return $$MechineLearning.enableTask({id: taskID}).$promise;
    };

    MachineLearningTriggerDetailService.disableTask = function(taskID){
      return $$MechineLearning.disableTask({id: taskID}).$promise;
    };

    MachineLearningTriggerDetailService.generateSchema = function(){
      var mlSchema = {
        "id": 43,
        "createDate": 1473177600000,
        "modifyDate": 1474387200000,
        "createBy": "0",
        "modifyBy": "640",
        "schemaType": "industrytemplate",
        "thingType": "ROOM_LIGHT",
        "name": "ROOM_LIGHT",
        "version": "1",
        "content": {
          "statesSchema": {
            "type": "object",
            "properties": {
              "PanelPower": {
                "displayNameCN": "人走概率",
                "enum": null,
                "maximum": 1,
                "minimum": 0,
                "type": "float",
                "unit": null,
                "enumType": null
              }
            },
            "title": "照明"
          },
          "actions": {}
        }
      };

      var $httpDefaultCache = $cacheFactory.get('$http');
      var queris = [
          'thingType=ROOM_LIGHT',
          'name=ROOM_LIGHT',
          'version=1'
      ];

      $httpDefaultCache.put(MyAPIs.SCHEMA + '/query/industrytemplate?' + queris.join('&'), mlSchema);
    }

    MachineLearningTriggerDetailService.createTrigger = function(triggerData){
      var $defer = $q.defer();

      MachineLearningTriggerDetailService.createVirtualThing('ROOM_LIGHT').then(function(thing){
        MachineLearningTriggerDetailService
          .createMLTask(thing.vendorThingID, triggerData.location)
          .then(function(taskID){
            triggerData.taskID = taskID;
            triggerData.thingID = thing.globalThingID;

            var trigger = MachineLearningTriggerDetailService.generateTrigger(triggerData).then(function(trigger){
              $$Trigger.save(trigger, function(trigger){
                $defer.resolve(trigger);
              }, function(err){
                $q.reject(err);
              });
            });
          }, function(err){
            $q.reject(err);
          });      
        }, function(err){
          $q.reject(err);
        });

      return $defer.promise;
    };

    MachineLearningTriggerDetailService.updateTrigger = function(triggerData){
      var $defer = $q.defer();

      $$Trigger.remove({triggerID: triggerData.triggerID}, function(){
        var trigger = MachineLearningTriggerDetailService.generateTrigger(triggerData);

        $$Trigger.save(trigger, function(trigger){
          $defer.resolve(trigger);
        }, function(err){
          $q.reject(err);
        });
      }, function(err){
        $defer.reject(err);
      });

      return $defer.promise;
    };

    MachineLearningTriggerDetailService.deleteTask = function(taskID){
      return $$MechineLearning.deleteTask({id: taskID}).$promise;
    }

    MachineLearningTriggerDetailService.cleanUp = function(triggerData){
      var data = MachineLearningTriggerDetailService.parseDescription(triggerData.description);
      var taskID = data.taskID;
      MachineLearningTriggerDetailService.deleteTask(taskID);
    };

    return MachineLearningTriggerDetailService;
  }
]);