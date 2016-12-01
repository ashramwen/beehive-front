'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('HistoryController', ['$scope', '$state', '$stateParams', '$$Notice', function($scope, $state, $stateParams, $$Notice) {
    if (!$stateParams.id) {
        $state.go('^.^');
    }

    $$Notice.query({}, { from: $stateParams.id }).$promise.then(function(res) {
        $scope.notices = res;
        console.log(res);
    });

    $scope.read = function(notice) {
        $$Notice.read({ id: notice.id }).$promise.then(function(res) {
            notice.readed = true;
        });
    }

    $scope.readAll = function() {

    }

    // go back
    $scope.goBack = function() {
        $state.go('^.Monitoring', { id: $stateParams.id });
    }
}]);