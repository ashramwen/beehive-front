
angular.module('BeehivePortal').controller('TriggerScheduleController', 
  ['$scope', 'AppUtils', 'TriggerDetailService', function($scope, AppUtils, TriggerDetailService){

    $scope.timeUnits = TriggerDetailService.timeUnits;
    $scope.timePeriod = {
      from: null,
      to: null,
      timeSpan: 'daily'
    };

    $scope.$watch('timePeriod', function(newVal){
      console.log(newVal);
    }, true);

    $scope.intervalType = 'once';
    $scope.onceType = 'exact';

  }]);