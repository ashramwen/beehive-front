'use strict';

angular.module('BeehivePortal')
  .controller('TriggerConditionListController', ['$scope', 'AppUtils', 'TriggerDetailService', function($scope, AppUtils, TriggerDetailService){

    $scope.options = [
      {text: 'triggerManager.any', value: true},
      {text: 'triggerManager.all', value: false}
    ];

    $scope.init = function(){
      $scope.trigger = $scope.triggerData;
    };

    $scope.$watch('triggerData', function(val){
      if(val){
        $scope.init();
      }
    });

    $scope.getPropertyValue = function(property){
        if(!property.enumType){
          return property.value;
        }
        if(property.enumType){
          var option = _.find(property.options, {value: property.value});
          if(option){
            return option.text;
          }else{
            return property.value;
          }
        }
    };

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