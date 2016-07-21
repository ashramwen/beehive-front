'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('ViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', function($scope, $rootScope, $state, AppUtils, $$User) {
    $scope.init = function() {
        $$User.getCustomData({ name: 'monitorViews' }).$promise.then(function(res) {
            $scope.views = res.views;
        });
    }

    $scope.newView = function() {
        $state.go('^.ViewManager');
    }

    $scope.monitoring = function(view) {
        $state.go('^.Monitoring', view);
    }
}]);
