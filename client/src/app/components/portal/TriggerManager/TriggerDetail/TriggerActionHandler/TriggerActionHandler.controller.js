
angular.module('BeehivePortal').controller('TriggerActionHandlerController', 
  ['$scope', 'AppUtils', 'TriggerDetailService', '$timeout', '$$Type', function($scope, AppUtils, TriggerDetailService, $timeout, $$Type){

    $scope.actionGroup = {
      type: null, 
      typeDisplayName: '', 
      things: [],
      actions: []
    };

    $scope.type = $scope.$state.params.type;

    $scope.$watch('triggerData', function(newVal){
      if(newVal){
        $scope.init();
      }
    });

    $scope.init = function(){
      var type = $scope.$state.params.type;

      var options = {
        usedTypes: _.pluck($scope.triggerData.actionGroups, 'type')
      };

      if(type){
        var actionGroup = _.find($scope.triggerData.actionGroups, {type: type});
        if(actionGroup){
          $scope.actionGroup = AppUtils.clone(actionGroup);

          _.extend(options, {
            selectedThings: $scope.actionGroup.things,
            onlyType: $scope.type
          });
        }
      }

      $timeout(function(){
        $scope.inputThingDataset(options);
      });
    };

    
    $scope.selectedChange = function(things, type){
      
      $$Type.getSchema({type: type}, function(schema){
        var _schema = TriggerDetailService.parseSchema(schema);
        $scope.actions = _schema.actions;

        if(!$scope.$state.params.type){
          $scope.actionGroup = {
            type: type, 
            typeDisplayName: _schema.displayName,
            actions: [],
            things: things
          };
        }else {
          _.each($scope.actions, function(action){
            var selectedAction = _.find($scope.actionGroup.actions, {actionName: action.actionName})
            action._selected = !!selectedAction;
            if(action._selected){
              _.each(selectedAction.properties, function(property){
                var _property = _.find(action.properties, { propertyName: property.propertyName});
                _.extend(property, _property);
              });
            }
          });
        }
      });
      
      $scope.actionGroup.things = things;
    };

    $scope.toggleAction = function(action){
      if(!action._selected){
        var _action = AppUtils.clone(action);
        $scope.actionGroup.actions.push(_action);
        delete _action._selected;
      }else{
        $scope.actionGroup.actions = _.reject($scope.actionGroup.actions, {actionName: action.actionName});
      }

      action._selected = !action._selected;
    };

    $scope.save = function(){
      var actionGroup = _.find($scope.triggerData.actionGroups, {type: $scope.type});

      _.each($scope.actionGroup.actions, function(action){
        action.properties = _.reject(action.properties, function(property){
          return !property.value && !angular.equals(property.value, 0) && !angular.equals(property.value, false);
        });
      });
      $scope.actionGroup.actions = _.reject($scope.actionGroup.actions, function(action){
        return action.properties.length == 0;
      });
      if(!actionGroup){
        if($scope.actionGroup.actions.length == 0){
          $scope.goBack();
          return;
        } 
        actionGroup = $scope.actionGroup;
        $scope.triggerData.actionGroups = $scope.triggerData.actionGroups || [];
        $scope.triggerData.actionGroups.push(actionGroup);
      }else{
        if($scope.actionGroup.actions.length == 0){
          $scope.triggerData.actionGroups.remove(actionGroup);
        }else{
          _.extend(actionGroup, $scope.actionGroup);
        }
      }
      console.log(actionGroup);

      $scope.goBack();
    };
}]);