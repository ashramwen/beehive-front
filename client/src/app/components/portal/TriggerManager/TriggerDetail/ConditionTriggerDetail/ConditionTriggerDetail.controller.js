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
                msg: '保存规则成功！',
                callback: function(){
                  $scope.$state.go(TriggerDetailService.States.TRIGGER_LIST);
                }
              });
            }, function(){
              AppUtils.alert({
                msg: '保存规则失败！'
              });
            });
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