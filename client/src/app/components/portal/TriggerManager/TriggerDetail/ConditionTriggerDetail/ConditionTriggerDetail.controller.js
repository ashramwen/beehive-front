'use strict';

angular.module('BeehivePortal')
  .controller('ConditionTriggerDetailController', ['$scope', '$rootScope', 'TriggerDetailService', 'ConditionTriggerDetailService', '$$Trigger', function($scope, $rootScope, TriggerDetailService, ConditionTriggerDetailService, $$Trigger) {

    $scope.conditions = [];

    $scope.init = function(){

    };

    $scope.save = function(){
      try{
        TriggerDetailService.dataValidation($scope.triggerData);

        var trigger = ConditionTriggerDetailService.generateTrigger($scope.triggerData);
        if(!$scope.triggerData.triggerID){
          $$Trigger.save(trigger);
        }else{
          $$Trigger.delete({triggerID: $scope.triggerData.triggerID}, function(){
            $$Trigger.save(trigger);
          });
        }
        
        console.log(trigger);
        
      }catch(e){
        console.log(e);
      }
    };

    $scope.$watch('triggerData', function(val){
      if(val){
        $scope.init();
      }
    });

  }]);