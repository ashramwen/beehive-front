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
            var initialized = false;

            scope.$watch('selectedModel', function(newVal, oldVal){
                // if(angular.equals(newVal, oldVal))return;
                init();
            });
            scope.$watch('options', function(newVal, oldVal){
                if(angular.equals(newVal, oldVal))return;
                init();
            });

            scope.setting.text = attrs.text || scope.setting.text;
            scope.setting.value = attrs.value || scope.setting.value;
            
            scope.selectOption = function(option){
                
                if(attrs.valueOnly){
                    scope.selectedModel = option[scope.setting.value];
                }else{
                    scope.selectedModel = _.clone(option);
                }

                if(_.isFunction(scope.change)){
                    scope.change(scope.selectedModel, initialized);
                }
                
                scope.selectedOption = option;
            };
            
            if(scope.options && scope.options[0]){
                init();   
            }

            function init(){
                initialized = false;
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
                        scope.selectOption(scope.options[0]);
                    }
                }else{
                    scope.selectOption(existFlag);
                }
                initialized = true;
            }
        }
    }
  }]);