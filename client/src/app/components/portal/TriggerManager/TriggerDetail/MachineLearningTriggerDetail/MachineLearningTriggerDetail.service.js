'use strict';

angular.module('BeehivePortal')
  .factory('MachineLearningTriggerDetailService',['$rootScope', '$$Type', '$q' , '$$Thing', 'TriggerDetailService', function($rootScope, $$Type, $q, $$Thing, TriggerDetailService) {
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
        $$Thing.onboard(thing, function(){
          $defer.resolve(result.globalThingID);
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

    return MachineLearningTriggerDetailService;
  }
]);