'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('HistoryController', ['$scope', '$state', '$stateParams', '$$Notice', 'ThingSchemaService', function($scope, $state, $stateParams, $$Notice, ThingSchemaService) {
    if (!$stateParams.id) {
        $state.go('^.^');
    }

    $$Notice.query({ 'pager': '10' }, { from: $stateParams.id }).$promise.then(function(res) {
        $scope.notices = res;
        ThingSchemaService.getThingByVendorThingID(res[0].title).then(function(thing) {
            console.log(thing);
        });
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