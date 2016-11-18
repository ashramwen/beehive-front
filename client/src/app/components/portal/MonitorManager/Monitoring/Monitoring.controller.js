'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('MonitoringController', ['$scope', '$rootScope', '$state', '$stateParams', 'ThingSchemaService', '$$User', 'WebSocketClient', '$timeout', '$$Thing', '$uibModal', function($scope, $rootScope, $state, $stateParams, ThingSchemaService, $$User, WebSocketClient, $timeout, $$Thing, $uibModal) {
    if ($stateParams.id === 0) {
        $state.go('^');
    }

    // get monitoring view
    $scope.view = $stateParams;

    // get monitoring view detail
    $$User.getUGC({
        type: 'monitorView',
        name: $scope.view.id
    }).$promise.then(function(res) {
        $scope.view = res.view || {};
        var ids = [];
        $scope.view.detail.forEach(function(thing) {
            ids.push(thing.id);
        });
        return $$Thing.getThingsByIDs(ids).$promise;
    }).then(function(res) {
        $scope.view.detail = res;
        $timeout(function() { waterfall('.card-columns') }, 0);
        ThingSchemaService.getSchema($scope.view.detail);
        if (WebSocketClient.isConnected()) {
            websocketInit();
            return
        }
        $scope.$on('stomp.connected', function() {
            websocketInit();
        });
    });

    $scope.displayValue = function(s) {
        if (!s.enum || !s.enum[s.value]) return s.value
        return s.enum[s.value];
    }

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
            parseState(thing, JSON.parse(res.body).state);
            $timeout(function() { waterfall('.card-columns') }, 0);
        });
    }

    var dirtyFields = ['target', 'taiwanNo1', 'novalue', 'date'];
    // parse the data from websocket
    function parseState(thing, states) {
        thing.off = states.hasOwnProperty('novalue');
        var _status;
        for (var key in states) {
            if (dirtyFields.indexOf(key) > -1) continue;
            _status = thing.status.find(function(o) {
                return o.name === key;
            });
            if (_status) {
                _status.value = states[key];
            } else {
                var _name = ThingSchemaService.getDisplayName(thing.type, key);
                if (_name) {
                    thing.status.push({
                        displayName: _name,
                        name: key,
                        value: states[key]
                    })
                }
            }
        }
    }

    // modify view
    $scope.modify = function() {
        $state.go('^.ViewManager', $scope.view);
    }

    // go back
    $scope.fallback = function() {
        $state.go('^');
    }

    $scope.setAlert = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app-portal-monitormanager-setalert',
            controller: 'AlertController',
            size: 'sm'
        });

        modalInstance.result.then(function(alert) {

        });
    };

    $scope.$on('$destroy', function() {
        WebSocketClient.unsubscribeAll();
    });

    // leave page
    // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    //     if (toState.name !== 'app.portal.MonitorManager.Monitoring') {
    //         WebSocketClient.unsubscribeAll();
    //     }
    // })
}])

.controller('AlertController', ['$scope', '$uibModalInstance', '$$Thing', function($scope, $uibModalInstance, $$Thing) {
    $scope.createAlert = function() {
        $scope.close();
    };

    $scope.close = function() {
        $uibModalInstance.close();
    }
}]);