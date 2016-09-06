angular.module('BeehivePortal')
  .directive('switchery',['$timeout', function($timeout){
        return {
            restrict: 'A',
            scope: {
                switchery: '=?switchery',
                options: '=?options',
                change: '&',
                disabled: '=?'
            },
            templateUrl: 'app/shared/directives/switchery/switchery.template.html',
            replace: true,
            link: function(scope, element, attrs){
                
                scope.yesText = attrs['yesText'] || '';
                scope.noText = attrs['noText'] || '';

                scope.switch = function(){
                    if(scope.disabled) return;
                    scope.on = !scope.on;
                    if(scope.options){
                        scope.change({value: scope.options[scope.on? 1: 0].value});
                        scope.switchery = scope.options[scope.on? 1: 0].value;
                    }else{
                        scope.change({value: scope.on});
                        scope.switchery = scope.on;
                    }
                };
                if(scope.options){
                    scope.noText = scope.options[0].text;
                    scope.yesText = scope.options[1].text;
                    if(scope.switchery === scope.options[1].value){
                        scope.on = true;
                    }else{
                        scope.on = false;
                        scope.switchery = scope.options[0].value;
                    }
                }else{
                    scope.on = scope.switchery;
                }
            }
        };
  }]);