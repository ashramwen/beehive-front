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