angular.module('BeehivePortal')
  .directive('triggerControlGroup', [function(){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            trigger: '=?'
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/trigger-control-group/trigger-control-group.template.html',
        controller: function($scope){
            $scope.deleteTrigger = function(trigger){
                $scope.$emit('deleteTrigger', trigger);
            };

            $scope.enableTrigger = function(trigger){
                $scope.$emit('enableTrigger', trigger);
            };

            $scope.disableTrigger = function(trigger){
                $scope.$emit('disableTrigger', trigger);
            };
        }
    };
  }]);