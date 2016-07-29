'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('MonitoringController', ['$scope', '$rootScope', '$state', '$stateParams', 'AppUtils', '$$User', 'WebSocketClient', function($scope, $rootScope, $state, $stateParams, AppUtils, $$User, WebSocketClient) {
    if ($stateParams.id === 0) {
        $state.go('^');
    }

    // get monitoring view
    $scope.view = $stateParams;

    // get monitoring view detail
    $$User.getCustomData({ name: 'mv_' + $scope.view.id }).$promise.then(function(res) {
        $scope.view.detail = res.detail || [];
        websocketInit();
    })

    // websocket connection
    function websocketInit() {
        var i = 0;
        for (; i < $scope.view.detail.length; i++) {
            subscription($scope.view.detail[i]);
        }
    }

    // thing subscription
    function subscription(thing) {
        WebSocketClient.subscribe('/topic/' + thing.kiiAppID + '/' + thing.kiiThingID, function(res) {
            var a = thing;
        });
    }

    // modify view
    $scope.modify = function() {
        $state.go('^.ViewManager', $scope.view);
    }

    // go back
    $scope.fallback = function() {
        $state.go('^');
    }

    // leave page
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name !== 'app.portal.MonitorManager.Monitoring') {
            WebSocketClient.unsubscribeAll();
        }
    })
}]);