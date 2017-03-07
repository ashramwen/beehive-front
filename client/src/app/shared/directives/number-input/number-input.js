angular.module('BeehivePortal')
  .directive('numberInput', ['$compile', function($compile){
    return{
      restrict: 'E',
      replace: true,
      require: 'ngModel',
      scope:{
          type: '=?',
          min: '=?',
          max: '=?',
          precise: '=?',
          suffix: '=?'
      },
      templateUrl: 'app/shared/directives/number-input/number-input.html',
      link: function($scope, element, attrs, ngModelCtrl){

        var init = false;

        function validateRange(modelValue, viewValue){
          if(_.isNumber($scope.max) && viewValue.value > $scope.max){
            return false;
          }
          if(_.isNumber($scope.min) && viewValue.value < $scope.min){
            return false;
          }
          return true;
        };

        function validatePrecise(modelValue, viewValue){
          if($scope.precise !== 0 && !$scope.precise) return true;
          if(viewValue.value === undefined) return true;
          var right = viewValue.value.toString().split('.')[1];
          if(!right) return true;
          if(right.length> $scope.precise){ 
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

        $scope.plus = function(){
          if($scope.value === undefined) {
            $scope.value = 1;
            return;
          }
          $scope.value += 1;
        };

        $scope.minus = function(){
          if($scope.value === undefined) {
            $scope.value = -1;
            return;
          }
          $scope.value -= 1;
        };
      }
    };
  }]);