'use strict';

angular.module('BeehivePortal')
  .controller('ConditionTriggerDetailController', ['$scope', '$rootScope', 'TriggerDetailService', function($scope, $rootScope, TriggerDetailService) {

    $scope.conditions = [];

    $scope.init = function(){
    };

    $scope.$watch('triggerData', function(val){
      if(val){
        $scope.init();
      }
    });

  }]);