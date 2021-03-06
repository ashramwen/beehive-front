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
                $scope.$state.go(TriggerDetailService.States.TRIGGER_LIST);
              }
            });
          }, function(err){
            AppUtils.alert({
              msg: '创建规则失败！'
            });
          });
        }else{
          $$Trigger.remove({triggerID: $scope.triggerData.triggerID}, function(){
            $$Trigger.save(trigger, function(trigger){
              AppUtils.alert({
                msg: 'triggerManager.triggerSavedMsg',
                callback: function(){
                  $scope.$state.go(TriggerDetailService.States.TRIGGER_LIST);
                }
              });
            }, function(err){
              AppUtils.alert({
                msg: '保存规则失败！'
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