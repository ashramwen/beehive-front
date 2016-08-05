'use strict';

angular.module('BeehivePortal')
  .directive('conditionInput', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            operator: '=?',
            property: '=?'
        },
        templateUrl: 'app/shared/directives/condition-input/condition-input.html',
        controller:['$scope', function($scope){

          $scope.operatorList = [
            {value: 'eq', text: '＝'},
            {value: 'gt', text: '＞'},
            {value: 'gte', text: '≥'},
            {value: 'lt', text: '＜'},
            {value: 'lte', text: '≤'}
          ];

          if(!$scope.property.expression){
            $scope.property.expression = $scope.operatorList[0].value;
          }

          $scope.getSelectedOperator = function(){
            return _.find($scope.operatorList, {value: $scope.property.expression});
          };

          $scope.selectOperator = function(option){
            $scope.property.expression = option.value;
          };


        }]
    };
  }]);