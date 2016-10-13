'use strict';

angular.module('BeehivePortal')
  .controller('MachineLearningTriggerDetailController', ['$scope', '$rootScope', 'TriggerDetailService', 'MachineLearningTriggerDetailService', '$$Trigger', 'AppUtils', function($scope, $rootScope, TriggerDetailService, MachineLearningTriggerDetailService, $$Trigger, AppUtils) {

    $scope.conditions = [];

    $scope.init = function(){
      MachineLearningTriggerDetailService.parseTrigger($scope.triggerData);
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
        MachineLearningTriggerDetailService.enableTask($scope.triggerData.taskID);
      }else{
        MachineLearningTriggerDetailService.disableTask($scope.triggerData.taskID);
      }
    });

  }]);