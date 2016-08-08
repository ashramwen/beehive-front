
angular.module('BeehivePortal')
  .controller('TriggerInfoController', ['$scope', 'AppUtils', 'TriggerDetailService', '$$Trigger', function($scope, AppUtils, TriggerDetailService, $$Trigger){
    
    $scope.$watch('triggerData', function(triggerData){
      if(!triggerData) return;
      $scope.trigger = $scope.triggerData;
    });

    $scope.toggleTriggerState = function(value){
      if(value){
        $$Trigger.enable({}, {triggerID: $scope.trigger.triggerID});
      }else{
        $$Trigger.disable({}, {triggerID: $scope.trigger.triggerID});
      }
    };

  }]);