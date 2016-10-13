
angular.module('BeehivePortal')
  .controller('MachineLearningPanelController', ['$scope', 'AppUtils', 'TriggerDetailService', '$$Type', function($scope, AppUtils, TriggerDetailService, $$Type){
    
    $scope.mlModels = [
      {
        text: "人走灯灭",
        value: "人走灯灭"
      }
    ];

    $scope.properties = [];

    $scope.init = function(){
      $scope.trigger = $scope.triggerData;
      $scope.trigger.model = $scope.trigger.model || {
        name: $scope.mlModels[0].value,
        properties: []
      };

      $scope.locationChange = function(location){
        $scope.trigger.location = location;
      }

      $scope.modelChanged('ROOM_LIGHT');
    };

    $scope.$watch('triggerData', function(val){
      if(val){
        $scope.init();
      }
    });

    $scope.modelChanged = function(modelName){
      $$Type.getSchema({type: modelName}, function(schema){

        var _schema = TriggerDetailService.parseSchema(schema);

        $scope.properties = _schema.properties;
        _.each($scope.properties, function(property){
          property._selected = !!_.find($scope.trigger.model.properties, {propertyName: property.propertyName});
        });
        
      });
    }
    

    $scope.toggleProperty = function(property){
      if(!property._selected){
        $scope.trigger.model.properties.push(AppUtils.clone(property));
      }else{
        $scope.trigger.model.properties = _.reject($scope.trigger.model.properties, {propertyName: property.propertyName});
      }

      property._selected = !property._selected;
    };

 }]);