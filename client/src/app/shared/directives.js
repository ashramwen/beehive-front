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
        link: function(scope, element, attrs){
            scope.$watch('ngModel', function(newVal){
                if(attrs['type'] == 'range' || attrs['type'] == 'number'){
                    scope.ngModel = parseFloat(newVal);
                }
            });
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
  }]);
  
  