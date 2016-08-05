'use strict';

angular.module('BeehivePortal')
  .controller('TriggerDetailController', ['$scope', '$rootScope', '$$Trigger', 'TriggerDetailService', 'ConditionTriggerDetailService', '$q', function($scope, $rootScope, $$Trigger, TriggerDetailService, ConditionTriggerDetailService, $q) {

    $scope.trigger = null;

    $scope.triggerData = null;

    $scope.init = function(){
      var triggerID = $scope.$state.params.triggerID;
      if(triggerID){
        $$Trigger.get({triggerID: triggerID}, function(trigger){
          $scope.trigger = trigger;
        });
      }else{
        /*
        $scope.trigger = {
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
        */
       $scope.trigger = ConditionTriggerDetailService.example;
      }

      var promiseList = [];

      promiseList.push(TriggerDetailService.parseTriggerConditions($scope.trigger));
      promiseList.push(TriggerDetailService.parseTriggerActions($scope.trigger));

      $q.all(promiseList).then(function(result){
        $scope.triggerData = {};
        $scope.triggerData.conditionGroups = result[0];
        $scope.triggerData.actionGroups = result[1];
        console.log($scope.triggerData);
      });
    };

    $rootScope.$watch('login', function(newVal){
      if(newVal){
        $scope.init();
      }
    });

  }]);