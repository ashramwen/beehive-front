'use strict';

angular.module('BeehivePortal')
  .directive('rpTimePickGroup', ['$compile', function($compile){
    return {
        restrict: 'A',
        link: function($scope, ele, attr){
            scope.$on('time-from-change', function(value){
                scope.$broadcast('time-from-changed', value);
            });
            scope.$on('time-to-change', function(value){
                scope.$broadcast('time-to-changed', value);
            });
        }
    };
  }])
  .directive('rpTimePickerFrom', ['$parse', function($parse){
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, ele, attr, ngModelCtrl){

            var ngModelGet = $parse(attrs.ngModel);
            scope.$watch(attrs.ngModel, function () {
                scope.$emit('time-from-change', ngModelGet(scope));
            });

            scope.$on('time-to-changed', function(toTime){
                var fromTime = ngModelGet(scope);

                if(toTime && fromTime){
                    var toHours = toTime.getHours();
                    var toMinutes = toTime.getMinutes();
                    var fromHourse = fromTime.getHours();
                    var fromMinutes = fromTime.getMinutes();

                    if(toHours<fromHourse){
                        fromTime.setHours(toHours);
                        if(toMinutes < fromTime){
                            fromTime.setMinutes(toMinutes);
                        }
                    }else if(toHours == fromHourse){
                        if(toMinutes < fromTime){
                            fromTime.setMinutes(toMinutes);
                        }
                    }
                }
            });
            var $hidden = $('<input type="hidden" />').insertAfter(ele);
            $hidden.timepicker({
                step: 15,
                  timeFormat: 'H:i',
                  show2400: true,
                  appendTo: 'body'
            });

            ngModelCtrl.$parsers.push(fromOutside);
        }
    };
  }])
  .directive('rpTimePickerTo', ['$parse', function($parse){
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function($scope, ele, attr, ngModelCtrl){

            var ngModelGet = $parse(attrs.ngModel);
            scope.$watch(attrs.ngModel, function () {
                scope.$emit('time-to-change', ngModelGet(scope));
            });
            ngModelCtrl.$parsers.push(fromOutside);
        }
    };
  }]);


/**
 * [fromOutside description]
 * @param  {[Date]} value [description]
 * @return {[transformedInput]}       [description]
 */
function fromOutside(value) {
    if (value) {
        var hour = value.getHours().toString();
        var min = value.getMinutes().toString();
        if(hour.length < 2){
            hour = '0' + hour;
        }
        if(min.length < 2){
            min = '0' + min;
        }

        ngModelCtrl.$setViewValue(hour + ' : ' + min);
        ngModelCtrl.$render();
        return value;
    }
    return undefined;
}        