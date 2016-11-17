'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('HistoryController', ['$scope', '$rootScope', '$state', '$stateParams', 'ThingSchemaService', '$$User', 'WebSocketClient', '$timeout', '$$Thing', function($scope, $rootScope, $state, $stateParams, ThingSchemaService, $$User, WebSocketClient, $timeout, $$Thing) {
    if ($stateParams.id === 0) {
        $state.go('^');
    }

    // modify view
    $scope.modify = function() {
        $state.go('^.ViewManager', $scope.view);
    }

    // go back
    $scope.fallback = function() {
        $state.go('^');
    }

    $scope.$on('$destroy', function() {
        WebSocketClient.unsubscribeAll();
    });
}]);