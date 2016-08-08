'use strict';

angular.module('BeehivePortal')
  .controller('ScheduleTriggerDetailController', ['$scope', '$rootScope', 'ScheduleTriggerDetailService', '$$Trigger', 'AppUtils', function($scope, $rootScope, ScheduleTriggerDetailService, $$Trigger, AppUtils) {
    
    $scope.save = function(){

      try{
        ScheduleTriggerDetailService.dataValidation($scope.triggerData);
        var trigger = ScheduleTriggerDetailService.generateTrigger($scope.triggerData);

        if(!$scope.triggerData.triggerID){
          $$Trigger.save(trigger, function(){
            AppUtils.alert('创建触发器成功！', '提示信息');
          });
        }else{
          $$Trigger.remove({triggerID: $scope.triggerData.triggerID}, function(){
            $$Trigger.save(trigger, function(trigger){
              AppUtils.alert('保存触发器成功！', '提示信息', function(){
                $scope.$state.go($scope.$state.current.name, {triggerID: trigger.triggerID});
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