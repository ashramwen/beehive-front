'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('HistoryController', ['$scope', '$state', '$stateParams', '$$Notice', function($scope, $state, $stateParams, $$Notice) {
    if (!$stateParams.id) {
        $state.go('^.^');
    }

    $$Notice.query({ 'pager': '10' }, { from: $stateParams.id }).$promise.then(function(res) {
        $scope.notices = res;
    });

    $scope.read = function(notice) {
        $$Notice.read({ id: notice.id }).$promise.then(function(res) {
            notice.readed = true;
        });
    }

    $scope.readAll = function() {
        // $$Notice.readAll({}, { from: $stateParams.id }).$promise.then(function(res) {
        //
        // });
    }

    // go back
    $scope.goBack = function() {
        $state.go('^.Monitoring', { id: $stateParams.id });
    }
}]);