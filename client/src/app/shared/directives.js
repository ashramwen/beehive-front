angular.module('BeehivePortal')
  .directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
  })
  .directive('permitted', ['PermissionControl', function(PermissionControl){
    return {
        link: function(scope, element, attrs){
            var actions = attrs['permitted'].split('&'),
                flag = true;

            _.each(actions, function(action){
                flag = flag & PermissionControl.allowAction(action);
            });

            if(!flag){
                element.remove();
            }
        }
    };
  }])
  .directive('input', [function(){
    return {
        restrict: 'E',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl){
            function fromUser(newVal){
                
                if(attrs['limit']){
                    if(newVal !== undefined || newVal !== null){
                        newVal = newVal.toLocaleString();
                        newVal = newVal.substr(0, parseInt(attrs['limit']));
                    }
                }
                if(attrs['type'] == 'range' || attrs['type'] == 'number'){
                    newVal = parseFloat(newVal);
                }
                
                return newVal;
            }
            if(attrs['type'] == 'time') return;
            if(!ngModelCtrl) return;
            ngModelCtrl.$parsers.push(fromUser);
        }
    }
  }])
  .directive('sglclick', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
          var fn = $parse(attr['sglclick']);
          var delay = 300, clicks = 0, timer = null;
          element.on('click', function (event) {
            clicks++;  //count clicks
            if(clicks === 1) {
              timer = setTimeout(function() {
                scope.$apply(function () {
                    fn(scope, { $event: event });
                }); 
                clicks = 0;             //after action performed, reset counter
              }, delay);
              } else {
                clearTimeout(timer);    //prevent single-click action
                clicks = 0;             //after action performed, reset counter
              }
          });
        }
    };
  }])
  .directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
  })
  .directive('positive', function() {
      return {
          restrict: "A",
          require: '?ngModel',
          link: function(scope, element, attrs, ngModelCtrl) {
              if (!ngModelCtrl) {
                  return;
              }

              ngModelCtrl.$parsers.push(function(val) {
                  if (val === null)
                    return;
                  if(_.isNumber(val)) return val;
                  var myRegex = /\d+\.(\d{1,2})?/;
                  var clean = myRegex.exec(val)[0];
                  if (val != clean) {
                      ngModelCtrl.$setViewValue(clean);
                      ngModelCtrl.$render();
                  }
                  return clean;
              });

              element.bind('keypress', function(event) {
                  if ([32, 45].indexOf(event.keyCode) > -1) {
                      event.preventDefault();
                  }
              });
          }
      };
  })
  .directive('autoWidth', function(){
    return{
      restrict: 'A',
      require: '?ngModel',
      link: function(scope, element, attrs, ngModelCtrl){
        var initialWidth = element.width();
        ngModelCtrl.$parsers.push(function(value){
          setTimeout(resize);
          return value;
        });

        function resize(){
          while(element.width() === element[0].scrollWidth){
            element.width(element.width() - 2);
          }
          var width = element[0].scrollWidth < initialWidth?
            initialWidth : element[0].scrollWidth;
            
          element.width(width);
        }

        setTimeout(resize);
      }
    };
  });
  
  