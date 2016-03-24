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
  }]);
  
  