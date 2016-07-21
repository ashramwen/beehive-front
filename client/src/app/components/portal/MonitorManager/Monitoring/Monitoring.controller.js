'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('MonitoringController', ['$scope', '$rootScope', '$state', '$stateParams', 'AppUtils', 'WebSocketClient', function($scope, $rootScope, $state, $stateParams, AppUtils, WebSocketClient) {
    $scope.view = $stateParams;

    // 編輯
    $scope.modify = function() {
        $state.go('^.ViewManager', $scope.view);
    }

    // 返回
    $scope.fallback = function() {
        $state.go($state.current.previous);
    }
}]);
