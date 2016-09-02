'use strict';

angular.module('BeehivePortal')
  .controller('ScheduleTriggerDetailController', ['$scope', '$rootScope', 'ScheduleTriggerDetailService', '$$Trigger', 'AppUtils', 'TriggerDetailService', function($scope, $rootScope, ScheduleTriggerDetailService, $$Trigger, AppUtils, TriggerDetailService) {
    
    $scope.save = function(){

      try{
        ScheduleTriggerDetailService.dataValidation($scope.triggerData);
        var trigger = ScheduleTriggerDetailService.generateTrigger($scope.triggerData);

        if(!$scope.triggerData.triggerID){
          $$Trigger.save(trigger, function(trigger){
            AppUtils.alert({
              msg: 'triggerManager.triggerCreatedMsg',
              callback: function(){
                $scope.$state.go(TriggerDetailService.States.SCHEDULE_TRIGGER, {triggerID: trigger.triggerID});
              }
            });
          });
        }else{
          $$Trigger.remove({triggerID: $scope.triggerData.triggerID}, function(trigger){
            $$Trigger.save(trigger, function(){
              AppUtils.alert({
                msg: 'triggerManager.triggerSavedMsg',
                callback: function(){
                  $scope.$state.go($scope.$state.current.name, {triggerID: trigger.triggerID});
                }
              });
            });
          });
          console.log(trigger);
        }
      }catch(e){
        console.log(e);
      }
    };
  }]);