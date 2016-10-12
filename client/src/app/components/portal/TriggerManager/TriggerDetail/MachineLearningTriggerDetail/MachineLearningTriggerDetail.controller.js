'use strict';

angular.module('BeehivePortal')
  .controller('MachineLearningTriggerDetailController', ['$scope', '$rootScope', 'TriggerDetailService', 'MachineLearningTriggerDetailService', '$$Trigger', 'AppUtils', function($scope, $rootScope, TriggerDetailService, MachineLearningTriggerDetailService, $$Trigger, AppUtils) {

    $scope.conditions = [];

    $scope.init = function(){
      MachineLearningTriggerDetailService.generateSchema();
      $scope.hideDescription = true;
    };

    $scope.save = function(){
      try{

        MachineLearningTriggerDetailService.dataValidation($scope.triggerData);

        if(!$scope.triggerData.triggerID){
          MachineLearningTriggerDetailService.createVirtualThing('ROOM_LIGHT').then(function(thing){
            MachineLearningTriggerDetailService
              .createMLTask(thing.fullKiiThingID, $scope.triggerData.location)
              .then(function(task){
                $scope.triggerData.taskID = task.taskID;

                var trigger = MachineLearningTriggerDetailService.generateTrigger($scope.triggerData);

                $$Trigger.save(trigger, function(trigger){
                  AppUtils.alert({
                    msg: 'triggerManager.triggerCreatedMsg',
                    callback: function(){
                      $scope.$state.go(TriggerDetailService.States.TRIGGER_LIST);
                    }
                  });
                });
              });
            
          }, function(){
            AppUtils.alert({
              msg: '创建虚拟设备失败！'
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