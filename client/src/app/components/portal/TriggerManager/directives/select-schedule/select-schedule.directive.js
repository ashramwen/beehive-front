angular.module('BeehivePortal')
  .directive('selectSchedule', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            schedule: '=?',
            disabled: '=?'
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/select-schedule/select-schedule.template.html',
        controller: ['$scope', '$$Tag', '$$Thing', '$timeout', '$q', function($scope, $$Tag, $$Thing, $timeout, $q){

            $scope.scheduleTypes = [
                {text: '间隔任务', value: 'Interval'},
                {text: '定时任务', value: 'Cron'},
            ];

            $scope.intervalUnits = [
                {text: '秒', value: 'Second'},
                {text: '分', value: 'Minute'},
                {text: '小时', value: 'Hour'},
                {text: '天', value: 'Day'}
            ];

            $scope.init = function(){
                $scope.schedule = $scope.schedule 
                    || {timeUnit: 'Second', interval: 0};

                $scope.initCron = initCron($scope.schedule.cron);
            };

            function initCron(cron){
                if(!cron) return '';
                if(cron.split(' ').length == 6){
                    return cron.substr(2);
                }
                return cron;
            }

            $scope.$watch('schedule.cron', function(val){
                $scope.initCron = initCron(val);
            });

        }]
    };
  }]);