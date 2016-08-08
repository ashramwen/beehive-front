angular.module('BeehivePortal')
  .directive('switchery',['$timeout', function($timeout){
        return {
            restrict: 'A',
            scope: {
                on: '=?switchery',
                change: '&',
                disabled: '=?'
            },
            templateUrl: 'app/shared/directives/switchery/switchery.template.html',
            replace: true,
            link: function(scope, element, attrs){
                scope.on = scope.on? true: false;
                
                scope.yesText = attrs['yesText'] || '';
                scope.noText = attrs['noText'] || '';
                scope.switch = function(){
                    if(scope.disabled) return;
                    scope.on = !scope.on;
                    scope.change({value: scope.on});
                }

            }
        };
  }]);