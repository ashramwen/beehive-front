angular.module('BeehivePortal')
  .directive('appSlider',['$timeout',function($timeout){
    return {
        restrict: 'E',
        templateUrl: 'app/shared/directives/app-slider/app-slider.template.html',
        replace: true,
        scope:{
            min: '=?',
            max: '=?',
            isInt: '=?',
            ngModel: '=?',
            disabled: '=?'
        },
        link: function(scope, element, attrs){
            scope.ngModel = scope.ngModel || scope.min;
            scope.rangeSlider = {
                value: scope.ngModel,
                options: {
                  floor: scope.min,
                  ceil: scope.max,
                  step: scope.isInt? 1: 0.01
                }
            };
        }
    }
}]);