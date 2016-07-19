'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('ViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', function($scope, $rootScope, $state, AppUtils, $$User) {
    $scope.init = function() {
        // WebSocketClient.getClient();
        // $$User.getCustomData({ name: 'monitorView' }, {
        //     id: 1,
        //     name: 'Monitor 1'
        // }).$promise.then(function(res) {
        //     console.log(res);
        // })
        $scope.views = [{
            id: 1,
            name: 'Monitor 1',
            count: 8
        }, {
            id: 2,
            name: 'Monitor 2',
            count: 8
        }, {
            id: 3,
            name: 'Hentai',
            count: 8
        }]
    }

    $scope.newView = function() {
        $state.go('^.ViewManager');
    }

    $scope.monitoring = function(view) {
        $state.go('^.Monitoring', view);
    }
}]);
