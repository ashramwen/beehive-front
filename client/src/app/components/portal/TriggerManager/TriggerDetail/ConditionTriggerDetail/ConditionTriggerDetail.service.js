'use strict';

angular.module('BeehivePortal')
  .factory('ConditionTriggerDetailService',['$rootScope', '$$Type', '$q' , '$$Thing', 'TriggerDetailService', function($rootScope, $$Type, $q, $$Thing, TriggerDetailService) {
    var ConditionTriggerDetailService = {};

    ConditionTriggerDetailService.dataValidation = function(triggerData){
      if(!triggerData.conditionGroups || !triggerData.conditionGroups.length){
        throw(new Error());
      }
      if(_.isEmpty(triggerData.name)){
        throw(new Error());
      }
      if(!triggerData.actionGroups || !triggerData.actionGroups.length){
        throw(new Error);
      }
      return true;
    };

    ConditionTriggerDetailService.generateTrigger = function(triggerData){

      var dataset = ConditionTriggerDetailService.generateSourcesAndConditions(triggerData);

      var trigger = {
        "name": triggerData.name,
        "description": triggerData.description,
        "type": "Summary",
        "predicate": {
          "triggersWhen" : "CONDITION_TRUE",
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

    ConditionTriggerDetailService.generateSourcesAndConditions = function(triggerData){

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

    function generateExpress(conditionGroup, property, any){
      var func = '';

      switch(property.expression){
        case 'lt':
        case 'lte':
          func = conditionGroup.any? 'min': 'max';
          break;
        case 'gt':
        case 'gte':
          func = conditionGroup.any? 'max': 'min';
          break;
        case 'eq':
          func = 'average';
          break;
      }

      return {
        "stateName": property.propertyName,
        "summaryAlias": property.propertyName,
        "function": func
      };
    };

    function generateCondtion(conditionGroup, property){
      var condition = {
        field: conditionGroup.type + '.' + property.propertyName
      };

      switch(property.expression){
        case 'lt':
          _.extend(condition, {
            upperLimit: property.value,
            upperIncluded: false,
            type: 'range'
          });
          break;
        case 'lte': 
          _.extend(condition, {
            upperLimit: property.value,
            upperIncluded: true,
            type: 'range'
          });
          break;
        case 'gt':
          _.extend(condition, {
            lowerLimit: property.value,
            lowerIncluded: false,
            type: 'range'
          });
          break;
        case 'gte':
          _.extend(condition, {
            lowerLimit: property.value,
            lowerIncluded: true,
            type: 'range'
          });
          break;
        case 'eq':
          _.extend(condition, {
            type: 'eq',
            value: property.value
          });
      }
      return condition;
    }



    return ConditionTriggerDetailService;
  }
]);