
angular.module('BeehivePortal')
  .controller('TriggerActionListController', ['$scope', 'AppUtils', 'TriggerDetailService', function($scope, AppUtils, TriggerDetailService){
       

    $scope.init = function(){
    };

    $scope.$watch('trigger', function(val){
      if(val){
        $scope.init();
      }
    });

    $scope.addActionGroup = function(){
      $scope.editActionGroup(null);
    };

    $scope.getProperties = function(action){
      return _.map(action.properties, function(property){
        if(!property.enumType){
          return property.displayName + ':' + property.value;
        }
        if(property.enumType){
          var option = _.find(property.options, {value: property.value});
          if(option){
            return property.displayName + ':' + option.text;
          }else{
            return property.displayName + ':' + property.value;
          }
        }
      }).join('<br/>');
    };

    $scope.editActionGroup = function(type){
      switch($scope.$state.current.name){
        case TriggerDetailService.States.NEW_SCHEDULE_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.NEW_SCHEDULE_TRIGGER_ACTION, _.extend({type: type}, state.params));
          break;
        case TriggerDetailService.States.SCHEDULE_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.SCHEDULE_TRIGGER_ACTION, _.extend({type: type}, state.params));
          break;
        case TriggerDetailService.States.NEW_CONDITION_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.NEW_CONDITION_TRIGGER_ACTION, _.extend({type: type}, state.params));
          break;
        case TriggerDetailService.States.CONDITION_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.CONDITION_TRIGGER_ACTION, _.extend({type: type}, state.params));
          break;
        case TriggerDetailService.States.NEW_ML_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.NEW_ML_TRIGGER_ACTION, _.extend({type: type}, state.params));
          break;
        case TriggerDetailService.States.ML_TRIGGER:
          $scope.$state.go(TriggerDetailService.States.ML_TRIGGER_ACTION, _.extend({type: type}, state.params));
          break;
      }
    };
       
  }]);