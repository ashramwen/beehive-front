'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('ViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', 'WebSocketClient', function($scope, $rootScope, $state, AppUtils, $$User, WebSocketClient) {
    $scope.init = function() {
        $$User.getCustomData({ name: 'monitorViews' }).$promise.then(function(res) {
            $scope.views = res.views;
        });
    }

    // add new view
    $scope.newView = function() {
        $state.go('^.ViewManager');
    }

    // browse monitoring view
    $scope.monitoring = function(view) {
        $state.go('^.Monitoring', view);
    }

    // delete view
    $scope.delete = function(index) {
        AppUtils.confirm('删除', '是否删除频道？', function() {
            $scope.views.splice(index, 1);
            $$User.setCustomData({ name: 'monitorViews' }, {
                views: $scope.views
            });
        })
    }
}]);