'use strict';

angular.module('BeehivePortal')
  .factory('MachineLearningTriggerDetailService',['$rootScope', '$$Type', '$q' , '$$Thing', 'TriggerDetailService', function($rootScope, $$Type, $q, $$Thing, TriggerDetailService) {
    var MachineLearningTriggerDetailService = {};

    MachineLearningTriggerDetailService.dataValidation = function(triggerData){
      if(triggerData.schedule.type == 'Interval'){
        if(!triggerData.schedule.timeUnit){
          throw(new Error);
        }
        if(!triggerData.schedule.interval){
          throw(new Error);
        }
      }else{
        if(triggerData.schedule.onceType == 'hourly'){
          if(!_.isNumber(triggerData.schedule.minute)){
            throw(new Error());
          }
        }else if(!triggerData.schedule.time){
          throw(new Error());
        }
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

    MachineLearningTriggerDetailService.generateTrigger = function(triggerData){

      var trigger = {
        "name": triggerData.name,
        "description": triggerData.description,
        "type": "Summary",
        "predicate": {
          "triggersWhen" : "CONDITION_TRUE",
          "schedule": MachineLearningTriggerDetailService.generateSchedule(triggerData)
        },
        "prepareCondition": TriggerDetailService.generatePrepareCondition(triggerData),
        "targets": TriggerDetailService.generateTargets(triggerData)
      };
      return trigger;
    }

    MachineLearningTriggerDetailService.generateSchedule = function(triggerDataset){
      var result = {
        type: triggerDataset.schedule.type
      };

      if(triggerDataset.schedule.type == 'Interval'){
        result.timeUnit = triggerDataset.schedule.timeUnit;
        result.interval = triggerDataset.schedule.interval;
      }else{
        if(triggerDataset.schedule.onceType != 'hourly'){
          result.cron = [
            0, 
            triggerDataset.schedule.time.getMinutes(), 
            triggerDataset.schedule.time.getHours(),
            '?',
            '*',
            '*'
          ].join(' ');
        }else{
          result.cron = [
            0, 
            triggerDataset.schedule.minute || 0, 
            '*',
            '?',
            '*',
            '*'
          ].join(' ');
        }
      }
      return result;
    };

    return MachineLearningTriggerDetailService;
  }
]);