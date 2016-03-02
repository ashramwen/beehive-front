angular.module('BeehivePortal')
  .directive('triggerCommand', ['$compile', '$$Tag', '$$Thing', '$timeout', '$uibModal', function($compile, $$Tag, $$Thing, $timeout, $uibModal){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            myActions: '=?',
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/trigger-command/trigger-command.template.html',
        controller: function($scope, $$Tag, $$Thing, $timeout, $q, $http){
            $scope.selectedAction = function(action){
                return action._checked;
            };
        }
    }
}]);