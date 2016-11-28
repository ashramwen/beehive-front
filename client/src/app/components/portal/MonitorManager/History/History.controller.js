'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('HistoryController', ['$scope', '$rootScope', '$state', '$stateParams', 'ThingSchemaService', '$$User', 'WebSocketClient', '$timeout', '$$Thing', function($scope, $rootScope, $state, $stateParams, ThingSchemaService, $$User, WebSocketClient, $timeout, $$Thing) {
    if (!$stateParams.id) {
        $state.go('^');
    }

    // modify view
    $scope.modify = function() {
        $state.go('^.ViewManager', $scope.view);
    }

    // go back
    $scope.goBack = function() {
        $state.go('^');
    }
}]);