
angular.module('BeehivePortal').controller('TriggerScheduleController', 
  ['$scope', 'AppUtils', 'TriggerDetailService', function($scope, AppUtils, TriggerDetailService){

    $scope.timeUnits = TriggerDetailService.timeUnits;
    
  }]);