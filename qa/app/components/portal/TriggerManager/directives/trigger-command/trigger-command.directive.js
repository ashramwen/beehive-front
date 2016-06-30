angular.module('BeehivePortal')
  .directive('triggerCommand', ['$compile', '$$Tag', '$$Thing', '$timeout', '$uibModal', function($compile, $$Tag, $$Thing, $timeout, $uibModal){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            myActions: '=?',
            disabled: '=?'
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/trigger-command/trigger-command.template.html',
        controller: function($scope, $$Tag, $$Thing, $timeout, $q, $http){

            $scope.selectedActions = [];
            $scope.actionOptions = [];

            $scope.$watch('myActions', function(newVal){
                $scope.actionOptions = [];
                _.each(newVal, function(action, actionName){
                    $scope.actionOptions.push({id: actionName, label: actionName, action: action});
                });
            });

            $scope.$watch('selectedActions', function(newVal){
                _.each(newVal, function(action){
                    $scope.myActions[action.id]._checked = true;
                });
            }, true);

            $scope.$watch('myActions', function(newVal){
                $scope.selectedActions = [];
                _.each(newVal, function(action, actionName){
                    if(action._checked){
                        $scope.selectedActions.push({id: actionName, label: actionName, action: action});
                    }
                });
            });
        }
    }
}]);