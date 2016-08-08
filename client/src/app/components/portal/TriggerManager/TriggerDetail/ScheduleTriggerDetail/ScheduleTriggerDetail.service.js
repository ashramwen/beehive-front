'use strict';

angular.module('BeehivePortal')
  .factory('ScheduleTriggerDetailService',['$rootScope', '$$Type', '$q' , '$$Thing', 'TriggerDetailService', function($rootScope, $$Type, $q, $$Thing, TriggerDetailService) {
    var ScheduleTriggerDetailService = {};

    ScheduleTriggerDetailService.dataValidation = function(triggerData){
      if(triggerData.schedule.type == 'Interval'){
        if(!triggerData.schedule.timeUnit){
          throw(new Error);
        }
        if(!triggerData.schedule.interval){
          throw(new Error);
        }
      }else{
        if(!triggerData.schedule.time){
          throw(new Error());
        }
      }

      if(_.isEmpty(triggerData.conditionGroups.name)){
        throw(new Error());
      }
      if(triggerData.actionGroups || triggerData.actionGroups.length){
        throw(new Error);
      }
      return true;
    };

    ScheduleTriggerDetailService.generateTrigger = function(triggerData){

      var trigger = {
        "name": triggerData.name,
        "description": triggerData.description,
        "type": "Summary",
        "predicate": {
          "triggersWhen" : "CONDITION_TRUE",
          "schedule": ScheduleTriggerDetailService.generateSchedule(triggerData)
        },
        "prepareCondition": TriggerDetailService.generatePrepareCondition(triggerData),
        "targets": TriggerDetailService.generateTargets(triggerData)
      };
      return trigger;
    }

    ScheduleTriggerDetailService.generateSchedule = function(triggerDataset){
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
            '？',
            '*',
            '*'
          ].join(' ');
        }else{
          result.cron = [
            0, 
            triggerDataset.schedule.time.getMinutes(), 
            '*',
            '？',
            '*',
            '*'
          ].join(' ');
        }
      }
      return result;
    };

    return ScheduleTriggerDetailService;
  }
]);