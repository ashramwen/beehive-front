angular.module('BeehivePortal')
  .directive('appSelect',['$timeout',function($timeout){
    return {
        restrict: 'A',
        templateUrl: 'app/shared/templates/select.template.html',
        replace: true,
        scope:{
            options: '=',
            selectedModel: '=',
            extraSetting: '=?',
            change: '=?'
        },
        link: function(scope, element, attrs){
            scope.setting = {
                text: 'text'
            };
            scope.myClass = attrs.class;
            scope.setting = _.extend(scope.setting, scope.extraSetting);

            scope.setting.text = attrs.text || scope.setting.text;
            
            scope.selectOption = function(option){
                scope.selectedModel = _.clone(option);
                if(_.isFunction(scope.change)){
                    $timeout(function(){
                        scope.change();    
                    });
                }
            };
            
            if(scope.options && scope.options[0]){
                scope.selectOption(scope.options[0]);
            }
            
        }
    }
  }])
  .directive('switchery',['$timeout', function($timeout){
        return {
            restrict: 'A',
            scope: {
                on: '=?switchery'
            },
            templateUrl: 'app/shared/templates/switchery.template.html',
            replace: true,
            link: function(scope, element, attrs){
                scope.on = scope.on;
                scope.yesText = attrs['yesText'] || '';
                scope.noText = attrs['noText'] || '';
                scope.switch = function(){
                    scope.on = !scope.on;
                }
            }
        };
  }])
  .directive('contextMenu',['$timeout','$compile','$http','$document', function ($timeout, $compile, $http, $document) {
    return {
        restrict: 'A',
        scope:{
            menu: '=?contextMenu',
            target: '=?target'
        },
        link: function(scope, element, attrs){
            $http.get('app/shared/templates/context-menu.template.html',
                {cache:true}
            ).success(function(result){


                var template = result,
                    last = null,
                    $template = $compile(template)(scope),
                    contextMenu = {};

                $template = angular.element($template).appendTo($('body'));
                $template.attr('id', attrs['context-menu']);
                $template.css('display', 'none');

                contextMenu.menuElement = $template;


                var opened = false;

                function open(event, menuElement) {
                    menuElement.css('display','block');

                    var doc = $document[0].documentElement;
                    var docLeft = (window.pageXOffset || doc.scrollLeft) -
                                  (doc.clientLeft || 0),
                        docTop = (window.pageYOffset || doc.scrollTop) -
                                 (doc.clientTop || 0),
                        elementWidth = menuElement[0].scrollWidth,
                        elementHeight = menuElement[0].scrollHeight;
                    var docWidth = doc.clientWidth + docLeft,
                        docHeight = doc.clientHeight + docTop,
                        totalWidth = elementWidth + event.pageX,
                        totalHeight = elementHeight + event.pageY,
                        left = Math.max(event.pageX - docLeft, 0),
                        top = Math.max(event.pageY - docTop, 0);

                    if (totalWidth > docWidth) {
                        left = left - (totalWidth - docWidth);
                    }

                    if (totalHeight > docHeight) {
                        top = top - (totalHeight - docHeight);
                    }

                    menuElement.css('top', top + 'px');
                    menuElement.css('left', left + 'px');
                    opened = true;
                }

                function close(menuElement) {
                    menuElement.css('display','none');

                    if (opened && _.isFunction(scope.closeCallback)) {
                        scope.closeCallback();
                    }

                    opened = false;
                }

                element.bind('contextmenu', function(event) {
                    if (contextMenu.menuElement !== null) {
                        close(contextMenu.menuElement);
                    }
                    contextMenu.menuElement = $template;
                    contextMenu.element = event.target;

                    event.preventDefault();
                    event.stopPropagation();
                    scope.$apply(function() {
                        if(_.isFunction(scope.callback))
                            scope.callback({ $event: event });
                    });
                    scope.$apply(function() {
                        open(event, contextMenu.menuElement);
                    });
                });

                scope.itemClick = function(menuItem){
                    if(_.isFunction(menuItem.callback)){
                        menuItem.callback(scope.target);
                    }
                    close(contextMenu.menuElement);
                }

                function handleKeyUpEvent(event) {
                    //console.log('keyup');
                    if (opened && event.keyCode === 27) {
                        scope.$apply(function() {
                            close(contextMenu.menuElement);
                        });
                    }
                }

                function handleClickEvent(event) {
                    if (opened &&
                        (event.button !== 2 ||
                            event.target !== contextMenu.element)) {
                        scope.$apply(function() {
                            close(contextMenu.menuElement);
                        });
                    }
                }

                $document.bind('keyup', handleKeyUpEvent);
                // Firefox treats a right-click as a click and a contextmenu event
                // while other browsers just treat it as a contextmenu event
                $document.bind('click', handleClickEvent);
                $document.bind('contextmenu', handleClickEvent);

                scope.$on('$destroy', function() {
                    //console.log('destroy');
                    $document.unbind('keyup', handleKeyUpEvent);
                    $document.unbind('click', handleClickEvent);
                    $document.unbind('contextmenu', handleClickEvent);
                });
            });
        }
    }
  }]);