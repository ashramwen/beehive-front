
angular.module('BeehivePortal').controller('TriggerConditionHandlerController', 
  ['$scope', 'AppUtils', 'TriggerDetailService', '$$Type', '$timeout', function($scope, AppUtils, TriggerDetailService, $$Type, $timeout){

    $scope.conditionGroup = {
      type: null, 
      id: null,
      typeDisplayName: '', 
      things: [],
      properties: []
    };

    $scope.type = $scope.$state.params.type;

    $scope.$watch('triggerData', function(newVal){
      if(newVal){
        $scope.init();
      }
    });

    $scope.init = function(){
      var type = $scope.$state.params.type;
      var id = $scope.$state.params.id;

      var options = {};
      if(type){
        var conditionGroup = _.find($scope.triggerData.conditionGroups, {type: type, id: id});
        if(conditionGroup){
          $scope.conditionGroup = AppUtils.clone(conditionGroup);
          _.extend(options, {
            selectedThings: $scope.conditionGroup.things,
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
        
        if(!$scope.$state.params.type){
          var changed = false;
          if(type != $scope.conditionGroup.type || !$scope.properties){
            $scope.properties = _schema.properties;
            changed = true;
          }
          if(changed){
            $scope.conditionGroup = {
              type: type, 
              typeDisplayName: _schema.displayName,
              properties: [],
              things: things
            };
          }
        }else {
          if($scope.$state.params.type == type){
            if(!$scope.properties){
              $scope.properties = _schema.properties;
            }
            _.each($scope.properties, function(property){
              property._selected = !!_.find($scope.conditionGroup.properties, {propertyName: property.propertyName});
            });
          }
        }
      });
      
      $scope.conditionGroup.things = things;
    };

    $scope.toggleProperty = function(property){
      if(!property._selected){
        $scope.conditionGroup.properties.push(AppUtils.clone(property));
      }else{
        $scope.conditionGroup.properties = _.reject($scope.conditionGroup.properties, {propertyName: property.propertyName});
      }

      property._selected = !property._selected;
    };

    $scope.save = function(){
      if($scope.ruleform.$invalid){
        AppUtils.alert({
          msg: '请确认表单填写正确。'
        });
        return;
      }
      var conditionGroup = _.find($scope.triggerData.conditionGroups, {type: $scope.type, id: $scope.$state.params.id});

      _.each($scope.conditionGroup.properties, function(property){
        if(property.enumType || property.type == 'boolean' || property.type.toLowerCase() == 'string' || property.type.toLowerCase() == 'date'){
          property.expression = 'eq';
        }
        property.expressionDisplay = TriggerDetailService.getExpressionDisplay[property.expression];
      });

      if(!conditionGroup){
        conditionGroup = $scope.conditionGroup;
        conditionGroup.id = ~~(Math.random() * 100000);
        conditionGroup.id = conditionGroup.id.toString();
        if(conditionGroup.properties.length == 0){
          $scope.goBack();
          return;
        }
        $scope.triggerData.conditionGroups = $scope.triggerData.conditionGroups || [];
        $scope.triggerData.conditionGroups.push(conditionGroup);
      }else{
        if($scope.conditionGroup.properties.length == 0){
            $scope.triggerData.conditionGroups.remove(conditionGroup);
        }else{
          _.extend(conditionGroup, $scope.conditionGroup);
        }
      }

      $scope.goBack();
    };
}]);