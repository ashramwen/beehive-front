'use strict';

angular.module('BeehivePortal')
  .controller('TriggerConditionListController', ['$scope', 'AppUtils', 'TriggerDetailService', function($scope, AppUtils, TriggerDetailService){

    $scope.options = [
      {text: 'triggerManager.any', value: true},
      {text: 'triggerManager.all', value: false}
    ];

    $scope.triggersWhenOptions = [
      {text: '为真', value: 'CONDITION_TRUE'},
      {text: '由假转真', value: 'CONDITION_FALSE_TO_TRUE'},
      {text: '由真转假', value: 'CONDITION_TRUE_TO_FALSE'},
      {text: '改变', value: 'CONDITION_CHANGED'}
    ];

    $scope.init = function(){
      $scope.trigger = $scope.triggerData;
      console.log($scope.trigger);
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

    $scope.editConditionGroup = function(type, id){
      switch($scope.$state.current.name){
        case TriggerDetailService.States.NEW_CONDITION_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.NEW_CONDITION_TRIGGER_CONDITION, _.extend({type: type, id: id}, state.params));
          return;
        case TriggerDetailService.States.CONDITION_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.CONDITION_TRIGGER_CONDITION, _.extend({type: type, id: id}, state.params));
          return;
        case TriggerDetailService.States.NEW_ML_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.NEW_ML_TRIGGER_CONDITION, _.extend({type: type, id: id}, state.params));
          return;
        case TriggerDetailService.States.ML_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.ML_TRIGGER_CONDITION, _.extend({type: type, id: id}, state.params));
          return;
      }
    };
    
  }]);