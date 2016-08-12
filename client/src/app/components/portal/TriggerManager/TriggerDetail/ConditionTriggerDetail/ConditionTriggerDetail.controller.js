'use strict';

angular.module('BeehivePortal')
  .controller('ConditionTriggerDetailController', ['$scope', '$rootScope', 'TriggerDetailService', 'ConditionTriggerDetailService', '$$Trigger', 'AppUtils', function($scope, $rootScope, TriggerDetailService, ConditionTriggerDetailService, $$Trigger, AppUtils) {

    $scope.conditions = [];

    $scope.init = function(){

    };

    $scope.save = function(){
      try{
        ConditionTriggerDetailService.dataValidation($scope.triggerData);

        var trigger = ConditionTriggerDetailService.generateTrigger($scope.triggerData);
        if(!$scope.triggerData.triggerID){
          $$Trigger.save(trigger, function(trigger){
            AppUtils.alert('规则创建成功', '提示信息', function(){
              $scope.$state.go(TriggerDetailService.States.CONDITION_TRIGGER, {triggerID: trigger.triggerID});
            });
          });
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