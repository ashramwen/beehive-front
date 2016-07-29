'use strict';

angular.module('BeehivePortal')
  .directive('rpDatePicker', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            lastDate: '=?',
            output: '=?'
        },
        templateUrl: 'app/shared/directives/rp-date-picker/rp-date-picker.html',
        controller:['$scope', '$$Location', function($scope, $$Location){
            
            $scope.options = [
                {value: 'm', text: '分钟'},
                {value: 'h', text: '小时'},
                {value: 'd', text: '天'},
                {value: 'w', text: '星期'},
                {value: 'M', text: '月'},
                {value: 'y', text: '年'}
            ];

            
            function dateOffset(date, offset){
                var d = new Date(date.getTime());
                d.setHours(0,0,0,0);
                d.setDate(date.getDate() + offset);
                return d;
            }

            $scope.init = function(){
                var now = new Date();
                now.setHours(0,0,0,0);
                var tommorrow = dateOffset(now, 1);
                var yesterday = dateOffset(now, -1);

                $scope.now = moment(now);

                $scope.settings = {
                    period: true,
                    from: yesterday,
                    to: now,
                    interval: 1,
                    unit: 'd'
                };
                _.extend($scope.settings, $scope.lastDate);

                $scope.selectedLastTime = {
                    interval: $scope.settings.interval,
                    unit: $scope.settings.unit
                };

                $scope.selectedPeriod = {
                    from: $scope.settings.from,
                    to: $scope.settings.to
                };

                $scope.timePeriod = {
                    from: moment($scope.settings.from),
                    to: moment($scope.settings.to)
                };

                $scope.$watch('timePeriod.from', output);
                $scope.$watch('timePeriod.to', output);
                $scope.$watch('selectedLastTime.interval', output);
                $scope.$watch('selectedLastTime.unit', output);
                $scope.$watch('settings.period', output);
            }

            function output(){
                if(!_.isFunction($scope.output)) return;

                var result = {
                    isPeriod: !!$scope.settings.period
                };
                if(result.isPeriod){
                    _.extend(result, {
                        from: $scope.timePeriod.from._d,
                        to: $scope.timePeriod.to._d
                    });
                }else{
                    _.extend(result, {
                        interval: $scope.selectedLastTime.interval,
                        unit: $scope.selectedLastTime.unit
                    });
                }

                $scope.output(result);
            }

        }]
    };
  }]);