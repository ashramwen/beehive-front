'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('MonitoringController', ['$scope', '$rootScope', '$state', '$stateParams', 'AppUtils', '$$User', 'WebSocketClient', function($scope, $rootScope, $state, $stateParams, AppUtils, $$User, WebSocketClient) {
    $scope.view = $stateParams;

    $$User.getCustomData({ name: 'mv_' + $scope.view.id }).$promise.then(function(res) {
        $scope.view.detail = res.detail || [];
        subscription();
    })

    function subscription() {
        WebSocketClient.reconnect().then(function(res) {
            var i = 0;
            for (; i < $scope.view.detail.length; i++) {
                subscribeThing($scope.view.detail[i]);
            }
        });
    }

    function subscribeThing(thing) {
        WebSocketClient.subscribe('/topic/' + thing.kiiAppID + '/' + thing.kiiThingID, function(res) {
            var a = thing;
        });
    }

    // 編輯
    $scope.modify = function() {
        $state.go('^.ViewManager', $scope.view);
    }

    // 返回
    $scope.fallback = function() {
        $state.go($state.current.previous);
    }
}]);
