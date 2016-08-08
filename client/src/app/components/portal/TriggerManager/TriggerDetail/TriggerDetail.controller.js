'use strict';

angular.module('BeehivePortal')
  .controller('TriggerDetailController', ['$scope', '$rootScope', '$$Trigger', 'TriggerDetailService', 'ConditionTriggerDetailService', '$q', 'AppUtils', function($scope, $rootScope, $$Trigger, TriggerDetailService, ConditionTriggerDetailService, $q, AppUtils) {

    $scope.triggerData = null;

    $scope.init = function(){
      var triggerID = $scope.$state.params.triggerID;
      var $defer = $q.defer();

      if(triggerID){
        $$Trigger.get({triggerID: triggerID}, function(trigger){
          $defer.resolve(trigger);
        });
      }else{
        var trigger = {
          "type" : "Summary",
          "predicate" : {
            "triggersWhen" : "CONDITION_TRUE"
          },
          "targets" : [],
          "policy" : {
            "groupPolicy" : "Percent",
            "criticalNumber" : 100
          }
        };
        $defer.resolve(trigger);
      }

      $defer.promise.then(function(trigger){
        var promiseList = [];

        promiseList.push(TriggerDetailService.parseTriggerConditions(trigger));
        promiseList.push(TriggerDetailService.parseTriggerActions(trigger));

        $q.all(promiseList).then(function(result){
          $scope.triggerData = {
            triggerID: trigger.triggerID,
            enabled: !(trigger.recordStatus == 'disable'),
            name: trigger.name || '',
            description: trigger.description || '',
            any: (trigger.predicate.condition && trigger.predicate.condition.type == "or") ? true: false,
            conditionGroups: result[0] || [],
            actionGroups: result[1] || [],
            timeSpan: TriggerDetailService.parseTimeSpan(trigger) || {},
            schedule: TriggerDetailService.parseSchedule(trigger) || {}
          };
          console.log($scope.triggerData);
        });
      });
      
    };

    $rootScope.$watch('login', function(newVal){
      if(newVal){
        $scope.init();
      }
    });

  }]);