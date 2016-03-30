angular.module('BeehivePortal')
  .directive('rangeSlider', [function(){
    return{
        restrict: 'E',
        replace: true,
        templateUrl: 'app/shared/directives/range-slider/range-slider.template.html',
        scope:{
            min: '=?',
            max: '=?',
            ngModel: '=?',
            disabled: '=?'
        },
        link: function(scope, element, attr){

            scope.$watch('ngModel', function(newVal, oldVal){
                newVal = parseFloat(newVal);
                if(scope.min || scope.min == 0){
                    if(newVal < scope.min){
                        newVal = oldVal;
                    }
                }
                if(scope.max || scope.max == 0){
                    if(newVal > scope.max){
                        newVal = oldVal;
                    }
                }
                scope.ngModel = newVal;
            });
        }
    }
  }]);