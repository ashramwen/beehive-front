
angular.module('BeehivePortal')
  .controller('TriggerTimeSpanController', ['$scope', 'AppUtils', 'TriggerDetailService', function($scope, AppUtils, TriggerDetailService){
      $scope.$watch('triggerData', function(triggerData){
        if(!triggerData) return;
        $scope.triggerData.timeSpan.intervalType = triggerData.timeSpan.intervalType || 'DAILY';
      });

  }]);