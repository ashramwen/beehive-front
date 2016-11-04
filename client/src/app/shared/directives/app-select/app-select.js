angular.module('BeehivePortal')
  .directive('appSelect',['$timeout',function($timeout){
    return {
        restrict: 'A',
        templateUrl: 'app/shared/directives/app-select/app-select.template.html',
        replace: true,
        scope:{
            options: '=',
            selectedModel: '=',
            extraSetting: '=?',
            change: '=?',
            disabled: '=?'
        },
        link: function(scope, element, attrs){
            scope.setting = {
                text: 'text',
                value: 'value'
            };
            scope.myClass = attrs.class;
            scope.setting = _.extend(scope.setting, scope.extraSetting);
            scope.selectedOption = {};
            scope.preventInit = false;

            scope.$watch('selectedModel', function(newVal, oldVal){
                if(scope.preventInit){
                    scope.preventInit = false;
                    return;
                }
                if(angular.equals(newVal, oldVal)){
                    scope.selectedOption = _.find(scope.options, function(option){
                        if(attrs.valueOnly){
                            return option[scope.setting.value] == newVal;
                        }else{
                            return angular.equals(option, newVal);
                        }
                    })
                    return;
                }
                init();
            });
            scope.$watch('options', function(newVal, oldVal){
                if(angular.equals(newVal, oldVal))return;
                init();
            });

            scope.setting.text = attrs.text || scope.setting.text;
            scope.setting.value = attrs.value || scope.setting.value;
            
            scope.selectOption = function(option, initialized){
                scope.preventInit = true;

                var targetValue = null;
                if(attrs.valueOnly){
                    targetValue = option[scope.setting.value];
                }else{
                    targetValue = _.clone(option);
                }

                if(_.isFunction(scope.change)){
                    if(scope.change(targetValue, initialized) === false){
                        scope.preventInit = false;
                        return;
                    }
                }

                scope.selectedModel = targetValue;
                scope.selectedOption = option;
            };
            
            if(scope.options && scope.options[0]){
                init();   
            }

            function init(){
                var existFlag = false;
                if(attrs.valueOnly){
                    existFlag = _.find(scope.options,function(option){
                        return option[scope.setting.value] == scope.selectedModel;
                    });
                }else{
                    existFlag = _.find(scope.options,function(option){
                        return angular.equals(option, scope.selectedModel);
                    });
                }
                
                if(!existFlag){
                    if(scope.options && scope.options.length > 0){
                        scope.selectOption(scope.options[0], true);
                    }
                }else{
                    scope.selectOption(existFlag, true);
                }
            }
        }
    }
  }]);