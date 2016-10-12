'use strict';

angular.module('BeehivePortal')
  .factory('MachineLearningTriggerDetailService',['$rootScope', '$$Type', '$q' , '$$Thing', 'TriggerDetailService', '$cacheFactory', '$MechineLearning', function($rootScope, $$Type, $q, $$Thing, TriggerDetailService, $cacheFactory, $MechineLearning) {
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
          $$Thing.getOnboardingInfo(thing, function(onboardingInfo){
            _.extend(thing, onboardingInfo);
          });
          $defer.resolve(thing);
        });
      }, function(err){
        $defer.reject(err);
      });

      return $defer.promsie;
    };

    MachineLearningTriggerDetailService.generateVendorThingID = function(){
      return ~~(Math.random() * 9000 + 1000) + 'Z-Z' + ~~(Math.random() * 90 + 10) + '-Y-' + ~~(Math.random() * 900 + 100);
    };

    MachineLearningTriggerDetailService.generateTrigger = function(triggerData){

      triggerData = angular.copy(triggerData);
      triggerData.conditionGroups.push({
        properties: triggerData.model.properties,
        things: [thing.globalThingID],
        type: 'ROOM_LIGHT',
        id: 'ROOM_LIGHT'
      });

      var description = {
        taskID: triggerData.taskID,
      };

      triggerData.description = JSON.stringify(description);

      var dataset = MachineLearningTriggerDetailService.generateSourcesAndConditions(triggerData);

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
        "targets": TriggerDetailService.generateTargets(triggerData)
      };

      _.each(trigger.predicate.condition.clauses, function(clause){
        clause.clauses.push(clause.clauses[0]);
      });

      trigger.predicate.condition.clauses.push(trigger.predicate.condition.clauses[0]);

      return trigger;
    };

    MachineLearningTriggerDetailService.parseModel = function(model){

    };

    MachineLearningTriggerDetailService.generateSourcesAndConditions = function(triggerData){

      var result = {
        sources: {},
        condition: {
          type: triggerData.any? 'or': 'and', 
          clauses: []
        }
      };

      _.each(triggerData.conditionGroups, function(conditionGroup){
        
        var expressList = [],
            conditionList = [];
      
        _.each(conditionGroup.properties, function(property){
          expressList.push(generateExpress(conditionGroup, property, triggerData.any));
          conditionList.push(generateCondtion(conditionGroup, property));
        });

        result.sources[conditionGroup.type] = {
          "source": {"thingList": _.pluck(conditionGroup.things, 'globalThingID')},
          "expressList": expressList
        };
        result.condition.clauses.push({
          type: 'and',
          clauses:conditionList
        });
      });
      return result;
    };

    /**
     * {taskID: String, mlModel: String}
     * @param  {[type]} description [description]
     * @return {[type]}             [description]
     */
    MachineLearningTriggerDetailService.parseDescription = function(description){
      var data = JSON.parse(description);

    };

    MachineLearningTriggerDetailService.createMLTask = function(kiiThingID, location){
      return $MechineLearning.createTask({
        virtualThingId: kiiThingID,
        roomNum: location
      }).$promise;
    }

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

    return MachineLearningTriggerDetailService;
  }
]);