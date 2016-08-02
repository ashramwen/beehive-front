angular.module('BeehivePortal.MonitorManager')

.directive('thingIfState', [function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            type: '=ngType',
            states: '=ngState'
        },
        templateUrl: 'app/components/portal/MonitorManager/directives/thing-if-state/thing-if-state.template.html',
        controller: ['$scope', function($scope) {

        }]
    };
}]);