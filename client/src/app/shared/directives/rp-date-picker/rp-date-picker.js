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
                    from: yesterday,
                    to: now,
                };
                _.extend($scope.settings, $scope.lastDate);

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
            }

            function output(){
                if(!_.isFunction($scope.output)) return;

                var result = {};
                
                _.extend(result, {
                    from: $scope.timePeriod.from._d,
                    to: $scope.timePeriod.to._d
                });
                
                $scope.output(result);
            }

        }]
    };
  }]);