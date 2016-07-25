'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('ViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', 'WebSocketClient', function($scope, $rootScope, $state, AppUtils, $$User, WebSocketClient) {
    $scope.init = function() {
        $$User.getCustomData({ name: 'monitorViews' }).$promise.then(function(res) {
            $scope.views = res.views;
        });

        // WebSocketClient.init();
    }

    $scope.newView = function() {
        $state.go('^.ViewManager');
    }

    $scope.monitoring = function(view) {
        $state.go('^.Monitoring', view);
    }
}]);
