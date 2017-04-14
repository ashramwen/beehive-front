'use strict';

angular.module('BeehivePortal')
  .directive('conditionInput', ['$compile', function($compile){
    return{
      restrict: 'E',
      replace: true,
      require: 'ngModel',
      scope:{
          operator: '=?',
          property: '=?'
      },
      templateUrl: 'app/shared/directives/condition-input/condition-input.html',
      link: function($scope, element, attrs, ngModelCtrl) {

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


        var init = false;

        function validateRange(modelValue, viewValue){
          if(_.isNumber($scope.property.maximum) && viewValue.value > $scope.property.maximum){
            return false;
          }
          if(_.isNumber($scope.property.minimum) && viewValue.value < $scope.property.minimum){
            return false;
          }
          return true;
        };

        function validatePrecise(modelValue, viewValue){
          if($scope.property.precise !== 0 && !$scope.property.precise) return true;
          if(viewValue.value === undefined) return true;
          var right = viewValue.value.toString().split('.')[1];
          if(!right) return true;
          if(right.length> $scope.property.precise){ 
            return false;
          }
          return true;
        }

        function required(modelValue, viewValue){
          if($scope.value === undefined || $scope.value === null || _.isNaN($scope.value)){
            return false;
          }
          return true;
        }

        function parser(newVal){
          if(!init){
            ngModelCtrl.$dirty = false;
            init = !init;
          }else{
            ngModelCtrl.$dirty = true;
          }
          if(newVal.value === undefined){
            return newVal.value;
          }
          
          if($scope.type === 'int'){
            return newVal.value |= 0;
          }

          return newVal.value;
        }

        function formatter(modelValue){
          return {
            value: modelValue
          };
        }

        $scope.$watch('value', function(newVal){
          ngModelCtrl.$setViewValue({value: newVal});
        });
        $scope.ngModelCtrl = ngModelCtrl;

        ngModelCtrl.$parsers.push(parser);
        ngModelCtrl.$formatters.push(formatter);
        ngModelCtrl.$validators.validateRange = validateRange;
        ngModelCtrl.$validators.validatePrecise = validatePrecise;
        ngModelCtrl.$render = function() {
          $scope.value = ngModelCtrl.$viewValue.value;
        };
        ngModelCtrl.$setValidity('validateRange', true);
        ngModelCtrl.$setValidity('validatePrecise', true);
        if(attrs.required){
          ngModelCtrl.$validators.required = required;
          ngModelCtrl.$setValidity('required', true);
        }
      }
    };
  }]);