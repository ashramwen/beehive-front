'use strict';

angular.module('BeehivePortal')
  .controller('TriggerConditionListController', ['$scope', 'AppUtils', 'TriggerDetailService', function($scope, AppUtils, TriggerDetailService){

    $scope.options = [
      {text: 'triggerManager.any', value: false},
      {text: 'triggerManager.all', value: true}
    ];

    $scope.init = function(){
      $scope.trigger = $scope.triggerData;
    };

    $scope.$watch('triggerData', function(val){
      if(val){
        $scope.init();
      }
    });

    $scope.addConditionGroup = function(){
      $scope.editConditionGroup(null);
    };

    $scope.editConditionGroup = function(type){
      switch($scope.$state.current.name){
        case TriggerDetailService.States.NEW_CONDITION_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.NEW_CONDITION_TRIGGER_CONDITION, _.extend({type: type}, state.params));
          return;
        case TriggerDetailService.States.CONDITION_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.CONDITION_TRIGGER_CONDITION, _.extend({type: type}, state.params));
          return;
      }
    };
    
  }]);