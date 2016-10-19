'use strict';

angular.module('BeehivePortal')
  .controller('MachineLearningTriggerDetailController', ['$scope', '$rootScope', 'TriggerDetailService', 'MachineLearningTriggerDetailService', '$$Trigger', 'AppUtils', function($scope, $rootScope, TriggerDetailService, MachineLearningTriggerDetailService, $$Trigger, AppUtils) {

    $scope.conditions = [];
    $scope.conditionGroupName = '机器学习规则触发条件';

    $scope.init = function(){
      if(!$scope.triggerData.inited){
        MachineLearningTriggerDetailService.parseTrigger($scope.triggerData);
        $scope.triggerData.inited = true;
      }
      $scope.hideDescription = true;
      
    };

    $scope.save = function(){
      try{

        MachineLearningTriggerDetailService.dataValidation($scope.triggerData);

        if(!$scope.triggerData.triggerID){
          MachineLearningTriggerDetailService.createTrigger($scope.triggerData).then(function(){
            AppUtils.alert({
              msg: 'triggerManager.triggerCreatedMsg',
              callback: function(){
                $scope.$state.go(TriggerDetailService.States.TRIGGER_LIST);
              }
            });
          }, function(){
            AppUtils.alert({
              msg: '创建触发器失败！'
            });
          });
        }else{
          MachineLearningTriggerDetailService.updateTrigger($scope.triggerData).then(function(){
            AppUtils.alert({
              msg: 'triggerManager.triggerSavedMsg',
              callback: function(){
                $scope.$state.go(TriggerDetailService.States.TRIGGER_LIST);
              }
            });
          }, function(err){
            AppUtils.alert({
              msg: '更新失败！',
              callback: function(){

              }
            });
          });
        }
        
      }catch(e){
        console.log(e.stack);
      }
    };

    $scope.$watch('triggerData', function(val){
      if(val){
        $scope.init();
      }
    });

    $scope.$on('trigger-state-change', function($event, enabled){
      if(enabled){
        $$Trigger.enable({}, {triggerID: $scope.triggerData.sourceTriggerID});
        //MachineLearningTriggerDetailService.enableTask($scope.triggerData.taskID);
      }else{
        $$Trigger.disable({}, {triggerID: $scope.triggerData.sourceTriggerID});
        //MachineLearningTriggerDetailService.disableTask($scope.triggerData.taskID);
      }
    });

  }]);