'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('MonitoringController', ['$scope', '$state', '$stateParams', 'ThingSchemaService', 'ThingMonitorService', '$$User', 'WebSocketClient', '$timeout', '$$Thing', '$uibModal', '$$Monitor', function($scope, $state, $stateParams, ThingSchemaService, ThingMonitorService, $$User, WebSocketClient, $timeout, $$Thing, $uibModal, $$Monitor) {
    if ($stateParams.id === 0) {
        $state.go('^');
        return;
    }

    // get monitoring view
    $scope.view = $stateParams;

    // $$Monitor.delete({id:'07abe290-bbc7-11e6-ac21-00163e007aba'});
    // $$Monitor.enable({id:'1fef9a10-bbc0-11e6-ac21-00163e007aba'});
    // $$Monitor.disable({id:'1fef9a10-bbc0-11e6-ac21-00163e007aba'});

    // get monitoring view detail
    $$User.getUGC({
        type: 'monitorView',
        name: $scope.view.id
    }).$promise.then(function(res) {
        $scope.view = res.view || {};
        var IDs = $scope.view.detail.map(function(thing) { return thing.id; });
        return ThingSchemaService.getThingAndSchema(IDs); // get thing detail and schema
    }).then(function(res) {
        $scope.view.detail = res;
        $timeout(function() { waterfall('.card-columns') }, 0);
        WebSocketClient.isConnected() ? websocketInit() : $scope.$on('stomp.connected', websocketInit);
        return $$Monitor.query({}, { name: $scope.view.id }).$promise; // get monitoring of the things
    }).then(function(res) {
        res.forEach(function(alert) {
            var thing = $scope.view.detail.find(function(t) { return t.vendorThingID === alert.things[0]; });
            alert.rules = alert.condition.clauses.map(function(c) {
                var _property = thing._schema.properties.find(function(p) { return p.propertyName === c.field; });
                var _rule = ThingMonitorService.fromClause(c, _property);
                var status = thing.status.find(function(o) { return o.name === _rule.propertyName; });
                if (status) {
                    status.expression = _rule.expression;
                    status.ruleValue = _rule.displayValue;
                }
                return _rule;
            })
            alert.rules = alert.rules || [];
            thing._alert = alert || {};
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
        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: 'app-portal-monitormanager-setalert',
            controller: 'AlertController',
            size: 'sm',
            resolve: {
                thing: _thing,
                viewID: $scope.view.id
            }
        });

        modalInstance.result.then(function() {

        });
    };

    $scope.$on('$destroy', function() {
        WebSocketClient.unsubscribeAll();
    });
}])

.controller('AlertController', ['$scope', '$uibModalInstance', '$$Monitor', 'ThingMonitorService', 'thing', 'viewID', function($scope, $uibModalInstance, $$Monitor, ThingMonitorService, thing, viewID) {
    $scope.properties = thing._schema.properties;
    if ($scope.properties && $scope.properties.length > 0)
        $scope.property = $scope.properties[0];
    $scope.thing = thing;

    // add/update rule
    $scope.add = function(property) {
        if (property.value === undefined || property.value === null) return;
        var rule = thing._alert.rules.find(function(rule) { return rule.propertyName === property.propertyName; });
        rule ? rule.update(property) : thing._alert.rules.push(ThingMonitorService.newRule(property));
    }

    // delete rule
    $scope.delete = function(rule, index) {
        thing._alert.rules.splice(index, 1);
    }

    // save monitor
    $scope.save = function() {
        var _data = {
            name: viewID + '.' + thing.id,
            things: [thing.vendorThingID],
            enable: true,
            condition: {
                type: 'or',
                clauses: thing._alert.rules.map(function(o) { return o.toClause() })
            }
        };
        if (thing._alert.monitorID) {
            // update
            $$Monitor.update({ id: thing._alert.monitorID }, _data).$promise.then(function(res) {
                // console.log(res);
            });
        } else {
            // new
            $$Monitor.add({}, _data).$promise.then(function(res) {
                thing._alert.monitorID = res.monitorID;
            });
        }
        $scope.close();
    };

    // close modal
    $scope.close = function() {
        $uibModalInstance.close();
    }
}]);