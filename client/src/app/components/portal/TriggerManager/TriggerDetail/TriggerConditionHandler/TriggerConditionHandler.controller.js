
angular.module('BeehivePortal').controller('TriggerConditionHandlerController', 
  ['$scope', 'AppUtils', 'TriggerDetailService', '$$Type', '$timeout', function($scope, AppUtils, TriggerDetailService, $$Type, $timeout){

    $scope.conditionGroup = {
      type: null, 
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

      var options = {
        usedTypes: _.pluck($scope.triggerData.conditionGroups, 'type')
      };

      if(type){
        $scope.conditionGroup = AppUtils.clone(_.find($scope.triggerData.conditionGroups, {type: type}));
        _.extend(options, {
          selectedThings: $scope.conditionGroup.things,
          onlyType: $scope.type
        });
      }

      $timeout(function(){
        $scope.inputThingDataset(options);
      });
    };

    $scope.selectedChange = function(things, type){
      
      $$Type.getSchema({type: type}, function(schema){
        var _schema = TriggerDetailService.parseSchema(schema);
        $scope.properties = _schema.properties;

        if(!$scope.$state.params.type){
          $scope.conditionGroup = {
            type: type, 
            typeDisplayName: _schema.displayName,
            properties: [],
            things: things
          };
        }else {
          _.each($scope.properties, function(property){
            property._selected = !!_.find($scope.conditionGroup.properties, {propertyName: property.propertyName});
          });
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
      var conditionGroup = _.find($scope.triggerData.conditionGroups, {type: $scope.type});

      _.each($scope.conditionGroup.properties, function(property){
        if(property.enumType || property.type == 'boolean'){
          property.expression = 'eq';
        }
        property.expressionDisplay = TriggerDetailService.getExpressionDisplay[property.expression];
      });

      if(!conditionGroup){
        conditionGroup = $scope.conditionGroup;
        $scope.triggerData.conditionGroups = $scope.triggerData.conditionGroups || [];
        $scope.triggerData.conditionGroups.push(conditionGroup);
      }else{
        _.extend(conditionGroup, $scope.conditionGroup);
      }

      $scope.goBack();
    };
}]);