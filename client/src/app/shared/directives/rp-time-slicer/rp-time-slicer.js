'use strict';

angular.module('BeehivePortal')
  .directive('rpTimeSlicer', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            input: '=?',
            output: '=?'
        },
        templateUrl: 'app/shared/directives/rp-time-slicer/rp-time-slicer.html',
        controller:['$scope', '$$Location', function($scope, $$Location){
            
            $scope.options = [
                {value: 'm', text: '分钟'},
                {value: 'H', text: '小时'},
                {value: 'd', text: '天'},
                {value: 'w', text: '星期'},
                {value: 'M', text: '月'},
                {value: 'y', text: '年'}
            ];

            $scope.$on('timeslice-input', function(e, options){
                _.extend($scope.settings, options);
                _.extend($scope.selectedSlice, options);
            });

            $scope.init = function(){
                $scope.settings = $scope.settings || {
                    interval: 1,
                    unit: 'H'
                }

                $scope.selectedSlice = {
                    interval: $scope.settings.interval,
                    unit: $scope.settings.unit
                };

                $scope.$watch('selectedSlice.interval', output);
                $scope.$watch('selectedSlice.unit', output);
            }

            function output(){
                if(!_.isFunction($scope.output)) return;

                var result = {
                    interval: parseInt($scope.selectedSlice.interval),
                    unit: $scope.selectedSlice.unit
                };

                $scope.output(result);
            }

        }]
    };
  }]);