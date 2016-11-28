'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('MonitoringController', ['$scope', '$rootScope', '$state', '$stateParams', 'ThingSchemaService', '$$User', 'WebSocketClient', '$timeout', '$$Thing', '$uibModal', '$$Monitor', function($scope, $rootScope, $state, $stateParams, ThingSchemaService, $$User, WebSocketClient, $timeout, $$Thing, $uibModal, $$Monitor) {
    if ($stateParams.id === 0) {
        $state.go('^');
    }

    // $$Monitor.get({ id: 1 });

    // get monitoring view
    $scope.view = $stateParams;

    var alerts = [];
    var monitor = {
        name: $scope.view.name,
        thing: [],
        condition: {},
        enable: true,
        creator: ''
    };

    // get monitoring view detail
    $$User.getUGC({
        type: 'monitorView',
        name: $scope.view.id
    }).$promise.then(function(res) {
        $scope.view = res.view || {};
        monitor.name = $scope.view.name;
        var ids = [];
        $scope.view.detail.forEach(function(thing) {
            ids.push(thing.id);
        });
        if (!$scope.view.monitorID) {
            // todo
        }
        return $$Thing.getThingsByIDs(ids).$promise;
    }).then(function(res) {
        $scope.view.detail = res;
        $timeout(function() {
            waterfall('.card-columns')
        }, 0);
        ThingSchemaService.getSchema($scope.view.detail).then(function(schemaList) {
            $scope.schemaList = ThingSchemaService.schemaList;
        });
        if (WebSocketClient.isConnected()) {
            websocketInit();
            return;
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
        for (var i = 0; i < $scope.view.detail.length; i++) {
            subscription($scope.view.detail[i]);
        }
    }

    // thing subscription
    function subscription(thing) {
        WebSocketClient.subscribe('/topic/' + thing.kiiAppID + '/' + thing.kiiThingID, function(res) {
            parseState(thing, JSON.parse(res.body).state);
            $timeout(function() {
                waterfall('.card-columns')
            }, 0);
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

    $scope.setAlert = function(_thing) {
        var _alert = alerts.find(function(o) {
            return o.id === _thing.id;
        });
        if (!_alert) {
            _alert = new Alert(_thing);
            alerts.push(_alert);
        }

        var modalInstance = $uibModal.open({
            animation: true,
            backdrop: 'static',
            templateUrl: 'app-portal-monitormanager-setalert',
            controller: 'AlertController',
            size: 'sm',
            resolve: {
                alert: _alert,
                schema: ThingSchemaService.filterSchema(_thing)
            }
        });

        modalInstance.result.then(function(alert) {
            genCondition();
            console.log(monitor);
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

    function genCondition() {
        var clauses = [];
        var things = [];
        alerts.forEach(function(alert) {
            things.push(alert.vendorThingID);
            var _field = [alert.type, alert.groupId, alert.id].join('#');
            alert.rules.forEach(function(o) {
                clauses.push({
                    field: _field + '.' + o.propertyName,
                    type: o.expression,
                    value: o.value
                });
            })
        });
        monitor.thing = things;
        monitor.condition = {
            'type': 'or',
            clauses: clauses
        }
    }

    function Alert(thing) {
        this.vendorThingID = thing.vendorThingID;
        this.type = thing.type;
        this.groupId = ~~(Math.random() * 100000);
        this.id = thing.id;
        this.rules = [];
    }
}])

.controller('AlertController', ['$scope', '$uibModalInstance', 'alert', 'schema', function($scope, $uibModalInstance, alert, schema) {
    $scope.properties = schema.properties;
    if ($scope.properties && $scope.properties.length > 0)
        $scope.property = $scope.properties[0];
    $scope.rules = alert.rules;
    $scope.add = function(property) {
        if (property.value === undefined || property.value === null) return;
        alert.rules.push(new Rule(property));
        console.log(property);
    }

    $scope.displaValue = function(rule) {
        var a = 1;
    }

    $scope.delete = function(rule, index) {
        $scope.rules.splice(index, 1);
    }

    $scope.save = function() {
        $scope.close();
    };

    $scope.close = function() {
        $uibModalInstance.close();
    }

    function Rule(property) {
        this.displayName = property.displayName;
        if (!property.enumType && (property.type === 'int' || property.type === 'float')) {
            this.displayValue = property.value;
        } else {
            var _displayValue = property.options.find(function(o) { return o.value === property.value });
            this.displayValue = _displayValue ? _displayValue.text : property.value;
        }
        this.enumType = property.enumType;
        this.type = property.type;

        this.propertyName = property.propertyName;
        this.expression = property.expression ? property.expression : 'eq';
        this.value = property.value;
    }
}]);