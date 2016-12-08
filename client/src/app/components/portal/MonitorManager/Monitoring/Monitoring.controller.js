'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('MonitoringController', ['$scope', '$state', '$stateParams', 'ThingSchemaService', 'ThingMonitorService', '$$User', 'WebSocketClient', '$timeout', '$$Thing', '$uibModal', '$$Monitor', function($scope, $state, $stateParams, ThingSchemaService, ThingMonitorService, $$User, WebSocketClient, $timeout, $$Thing, $uibModal, $$Monitor) {
    if ($stateParams.id === 0) {
        $state.go('^');
        return;
    }

    // get monitoring view
    $scope.view = $stateParams;

    var alerts = [];
    // $$Monitor.delete({id:'07abe290-bbc7-11e6-ac21-00163e007aba'});
    // $$Monitor.enable({id:'1fef9a10-bbc0-11e6-ac21-00163e007aba'});
    // $$Monitor.disable({id:'1fef9a10-bbc0-11e6-ac21-00163e007aba'});
    // get monitoring view detail
    $$User.getUGC({
        type: 'monitorView',
        name: $scope.view.id
    }).$promise.then(function(res) {
        $scope.view = res.view || {};
        var ids = $scope.view.detail.map(function(thing) { return thing.id; });
        return ThingSchemaService.getThingsDetail(ids);
    }).then(function(res) {
        $scope.view.detail = res;
        $timeout(function() { waterfall('.card-columns') }, 0);
        WebSocketClient.isConnected() ? websocketInit() : $scope.$on('stomp.connected', websocketInit);
        return ThingSchemaService.getSchema($scope.view.detail);
    }).then(function(schemaList) {
        $scope.schemaList = ThingSchemaService.schemaList;
        $scope.view.detail.forEach(function(thing) {
            thing._schema = ThingSchemaService.filterSchema(thing);
        });
        return $$Monitor.query({}, { name: $scope.view.id }).$promise;
    }).then(function(res) {
        alerts = res.map(function(alert) {
            var _thing = $scope.view.detail.find(function(t) { return t.vendorThingID === alert.things[0]; });
            alert.rules = alert.condition.clauses.map(function(c) {
                var _property = _thing._schema.properties.find(function(p) { return p.propertyName === c.field; });
                var _rule = ThingMonitorService.fromClause(c, _property);
                var status = _thing.status.find(function(o) { return o.name === _rule.propertyName; });
                if (status) {
                    status.expression = _rule.expression;
                    status.ruleValue = _rule.displayValue;
                }
                return _rule;
            })
            return alert;
        });
    });

    $scope.displayValue = function(s) {
        if (!s.enum || !s.enum[s.value]) return s.value
        return s.enum[s.value];
    }

    // websocket connection
    function websocketInit() {
        for (var i = 0; i < $scope.view.detail.length; i++) {
            subscription($scope.view.detail[i]);
        }
    }

    // thing subscription
    function subscription(thing) {
        WebSocketClient.subscribe('/topic/' + thing.kiiAppID + '/' + thing.kiiThingID, function(res) {
            parseState(thing, JSON.parse(res.body).state);
            $timeout(function() { waterfall('.card-columns') }, 0);
        });
        WebSocketClient.subscribe('/socket/users/notices', function(res) {
            console.log('notice', res);
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

    // set alert
    $scope.setAlert = function(_thing) {
        var _alert = alerts.find(function(o) {
            return o.name === $scope.view.id + '.' + _thing.id;
        });

        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: 'app-portal-monitormanager-setalert',
            controller: 'AlertController',
            size: 'sm',
            resolve: {
                alert: _alert || {},
                thing: _thing,
                viewID: $scope.view.id
            }
        });

        modalInstance.result.then(function(alert) {
            var _alert = alerts.find(function(o) { return o.name === $scope.view.id + '.' + _thing.id; });
            if (alert.monitorID) _alert.monitorID = alert.monitorID;
            if (alert.rules) _alert.rules = alert.rules;
        });
    };

    $scope.$on('$destroy', function() {
        WebSocketClient.unsubscribeAll();
    });
}])

.controller('AlertController', ['$scope', '$uibModalInstance', '$$Monitor', 'ThingMonitorService', 'alert', 'thing', 'viewID', function($scope, $uibModalInstance, $$Monitor, ThingMonitorService, alert, thing, viewID) {
    $scope.properties = thing._schema.properties;
    if ($scope.properties && $scope.properties.length > 0)
        $scope.property = $scope.properties[0];
    $scope.rules = alert.rules || [];
    $scope.add = function(property) {
        if (property.value === undefined || property.value === null) return;
        var rule = $scope.rules.find(function(rule) { return rule.propertyName === property.propertyName; });
        rule ? rule.update() : $scope.rules.push(ThingMonitorService.newRule(property));
    }

    // delete rule
    $scope.delete = function(rule, index) {
        $scope.rules.splice(index, 1);
    }

    // save monitor
    $scope.save = function() {
        var _data = {
            name: viewID + '.' + thing.id,
            things: [thing.vendorThingID],
            enable: true,
            condition: {
                type: 'or',
                clauses: $scope.rules.map(function(o) { return o.toClause() })
            }
        };
        if (alert.monitorID) {
            // update
            $$Monitor.update({ id: alert.monitorID }, _data).$promise.then(function(res) {
                console.log(res);
            });
        } else {
            // new
            $$Monitor.add({}, _data).$promise.then(function(res) {
                alert.monitorID = res.monitorID;
            });
        }
        $scope.close();
    };

    // close modal
    $scope.close = function() {
        $uibModalInstance.close(alert);
    }
}]);