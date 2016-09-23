'use strict';

angular.module('BeehivePortal')
  .directive('rpTimePickerGroup', ['$compile', function($compile){
    return {
        restrict: 'A',
        link: function(scope, ele, attr){
            scope.$on('time-from-change', function(event, value){
                scope.$broadcast('time-from-changed', value);
            });
            scope.$on('time-to-change', function(event, value){
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

            $(ele).on('keydown', function(){
                return false;
            });

            scope.$watch(attr['ngModel'],function(value){
                scope.$emit('time-from-change', value);
            });

            scope.$on('time-to-changed', function(event, toTime){
                var fromTime = scope[attr['ngModel']];
                var maxTime = null;

                if(toTime){
                    maxTime = toTime;
                }else{
                    maxTime = getMaxTime();
                }

                $(ele).timepicker('option', {
                    maxTime: maxTime
                });
            });

            var maxTime = new Date();
                maxTime.setDate(maxTime.getDate() + 1);
                maxTime.setHours(0);
                maxTime.setMinutes(-1);
                maxTime.setSeconds(0);

            $(ele).timepicker({
                maxTime: maxTime,
                step: 15,
                timeFormat: 'H:i',
                show2400: true,
                appendTo: 'body'
            });

            ngModelCtrl.$parsers.push($parser());
            ngModelCtrl.$formatters.push($formatter());
        }
    };
  }])
  
  .directive('rpTimePickerTo', ['$parse', function($parse){
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, ele, attr, ngModelCtrl){

            $(ele).on('keydown', function(){
                return false;
            });

            scope.$on('time-from-changed', function(event, fromTime){
                var toTime = scope[attr['ngModel']];
                var minTime = null;
                var maxTime = getMaxTime();

                if(fromTime){
                    minTime = fromTime;
                }else{
                    minTime = new Date();
                    minTime.setHours(0);
                    minTime.setMinutes(0);
                    minTime.setMilliseconds(0);
                }

                $(ele).timepicker('option', {
                    minTime: minTime,
                    maxTime: maxTime
                });
            });

            scope.$watch(attr['ngModel'], function(value){
                scope.$emit('time-to-change', value);
            });

            $(ele).timepicker({
                step: 15,
                timeFormat: 'H:i',
                show2400: true,
                appendTo: 'body'
            });

            ngModelCtrl.$parsers.push($parser());
            ngModelCtrl.$formatters.push($formatter());
        }
    };
  }]);
  
function getMaxTime(){
    var maxTime = new Date();
    maxTime.setDate(maxTime.getDate() + 1);
    maxTime.setHours(0);
    maxTime.setMinutes(-1);
    maxTime.setSeconds(0);
    return maxTime;
}

function $formatter(){
    return getDateDisplay;
}

/**
 * [fromOutside description]
 * @param  {[Date]} value [description]
 * @return {[transformedInput]}       [description]
 */
function $parser(){
    return function (viewValue) {
        if(viewValue){
            var newViewValue, modelValue;
            if (_.isString(viewValue)) {
                var hour, min, time;
                hour = parseInt(viewValue.split(':')[0]);
                min = parseInt(viewValue.split(':')[1]);
                time = new Date();

                time.setHours(hour);
                time.setMinutes(min);
                modelValue = time;
                // newViewValue = viewValue;
                //ngModelCtrl.$setViewValue(newViewValue);
                //ngModelCtrl.$render();
            }else if(viewValue instanceof Date){
                //ngModelCtrl.$setViewValue(getDateDisplay(value));
                //ngModelCtrl.$render();
                modelValue = viewValue;
            }

            return modelValue;
        }
        
        return undefined;
    }  
}

function getDateDisplay(value){
    if(!value){
        return '';
    }else{
        var hour = value.getHours().toString();
        var min = value.getMinutes().toString();
        if(hour.length < 2){
            hour = '0' + hour;
        }
        if(min.length < 2){
            min = '0' + min;
        }
        return [hour,min].join(':');
    }
}
