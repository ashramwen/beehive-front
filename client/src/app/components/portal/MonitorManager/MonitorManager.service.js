angular.module('BeehivePortal.MonitorManager')

.factory('ThingSchemaService', ['$$Thing', '$$Schema', 'TriggerDetailService', '$q', function($$Thing, $$Schema, TriggerDetailService, $q) {
    var typeList = [];
    var schemaList = [];

    var things = [];

    var dirtyFields = ['target', 'taiwanNo1', 'novalue', 'date'];

    function displayName(thing, schema) {
        // thing.actions = schema.actions;
        thing.typeDisplayName = schema.displayName;
        var properties = schema.properties;
        var property;
        thing.status.forEach(function(s, i) {
            property = _.findWhere(properties, { propertyName: s.name });
            if (property) {
                s.displayName = property.displayName;
                if (property.enum) {
                    s.enum = parseEnum(property.enum);
                }
            } else {
                s.displayName = s.name;
            }
        });
    }

    function parseEnum(_enum) {
        var ret = {};
        for (var e in _enum) {
            ret[_enum[e]] = e;
        }
        return ret;
    }

    function parseStatus(thing) {
        thing.typeDisplayName = thing.type;
        thing.off = _.isEmpty(thing.status) || thing.status.hasOwnProperty('novalue');
        for (var key in thing.status) {
            if (dirtyFields.indexOf(key) > -1)
                delete thing.status[key];
        }
        thing.status = _.map(thing.status, function(value, key) {
            return {
                name: key,
                displayName: key,
                value: value
            };
        });
    }

    function filterThing(IDs) {
        var thingList = things.filter(function(t) {
            if (IDs.indexOf(t.id) > -1) return t;
        });
        return thingList;
    }

    return {
        getThingsDetail: function(IDs) {
            var $defer = $q.defer();
            $$Thing.getThingsByIDs(IDs).$promise.then(function(res) {
                $defer.resolve(res);
            });
            return $defer.promise;
        },
        getSchema: function(_things) {
            var $defer = $q.defer();
            var promiseList = [];
            _things.forEach(function(thing) {
                parseStatus(thing);
                if (_.indexOf(typeList, thing.type) > -1) return;
                typeList.push(thing.type);
                var $promise = $$Schema.getByType({
                    thingType: thing.type,
                    name: thing.schemaName,
                    version: thing.schemaVersion
                }, function(schema) {
                    var _schema = TriggerDetailService.parseSchema(schema)
                    schemaList.push(_schema);
                }).$promise;
                promiseList.push($promise);
            });
            $q.all(promiseList).then(function() {
                var schema;
                _things.forEach(function(thing) {
                    schema = _.findWhere(schemaList, { name: thing.schemaName });
                    displayName(thing, schema);
                    thing._schema = schema;
                });
                $defer.resolve(schemaList);
            });

            return $defer.promise;
        },
        getThingAndSchema: function(IDs) {
            var $defer = $q.defer();
            var emptyList = IDs.filter(function(o) {
                if (!things.find(function(t) { return t.id === o })) return o;
            });
            if (emptyList.length) {
                this.getThingsDetail(emptyList).then(function(res) {
                    things = things.concat(res);
                    return this.getSchema(res);
                }.bind(this)).then(function(res) {
                    $defer.resolve(filterThing(IDs));
                });
            } else {
                $defer.resolve(filterThing(IDs));
            }
            return $defer.promise;
        },
        getThingByVendorThingID: function(vendorThingID) {
            var $defer = $q.defer();
            var thing = things.find(function(t) { t.vendorThingID === vendorThingID });
            if (thing) {
                $defer.resolve(thing);
            } else {
                this.getThingAndSchema([1502]).then(function() {
                    $defer.resolve(things[0]);
                });
            }
            return $defer.promise;
        },
        getDisplayName: function(type, name) {
            var _index = _.indexOf(typeList, type);
            if (_index === -1) return;
            var properties = schemaList[_index].properties;
            var property = properties.find(function(o) {
                return o.propertyName === name;
            });
            return property ? property.displayName : undefined;
        },
        filterSchema: function(t) {
            var schema = schemaList.find(function(o) {
                return o.name === t.schemaName && o.version === t.schemaVersion;
            });
            return schema;
        },
        schemaList: schemaList
    }
}])

.factory('ThingMonitorService', ['$$Schema', 'TriggerDetailService', '$q', function($$Schema, TriggerDetailService, $q) {

    function Rule(property) {
        this._property = property;
        this.displayName = property.displayName;
        this.enumType = property.enumType;
        this.type = property.type;

        this.propertyName = property.propertyName;
        this.update(property);
    }

    Rule.prototype.update = function(_property) {
        if (!_property.enumType && (_property.type === 'int' || _property.type === 'float')) {
            this.displayValue = _property.value;
        } else {
            var _displayValue = _property.options.find(function(o) { return o.value === _property.value }.bind(this));
            this.displayValue = _displayValue ? _displayValue.text : _property.value;
        }
        this.expression = _property.expression ? _property.expression : 'eq';
        this.value = _property.value;
    }

    Rule.prototype.toClause = function() {
        var clause = null;
        switch (this.expression) {
            case 'gt':
                clause = {
                    type: 'range',
                    field: this.propertyName,
                    lowerLimit: this.value,
                    lowerIncluded: false
                };
                break;
            case 'gte':
                clause = {
                    type: 'range',
                    field: this.propertyName,
                    lowerLimit: this.value
                }
                break;
            case 'lt':
                clause = {
                    type: 'range',
                    field: this.propertyName,
                    upperLimit: this.value,
                    upperIncluded: false
                }
                break;
            case 'lte':
                clause = {
                    type: 'range',
                    field: this.propertyName,
                    upperLimit: this.value
                }
                break;
            default:
                clause = {
                    type: 'eq',
                    field: this.propertyName,
                    value: this.value
                }
                break;
        }
        return clause;
    }

    Rule.fromClause = function(_clause, _property) {
        _property = angular.copy(_property);
        if (_clause.type === 'eq') {
            _property.value = _clause.value;
            _property.expression = _clause.type;
        } else if (_clause.hasOwnProperty('lowerIncluded')) {
            _property.value = _clause.lowerLimit;
            _property.expression = 'gt';
        } else if (_clause.hasOwnProperty('upperIncluded')) {
            _property.value = _clause.upperLimit;
            _property.expression = 'lt';
        } else if (_clause.hasOwnProperty('lowerLimit')) {
            _property.value = _clause.lowerLimit;
            _property.expression = 'gte';
        } else {
            _property.value = _clause.upperLimit;
            _property.expression = 'lte';
        }
        return new Rule(_property);
    }

    return {
        newRule: function(_property) {
            return new Rule(_property);
        },
        fromClause: Rule.fromClause
    }
}])

.factory('WebSocketClient', ['$rootScope', 'Session', function($rootScope, Session) {
    var _client = {};
    var subscriptions = [];
    var init = (function() {
        _client = Stomp.client(webSocketPath);
        var connect_callback = function(frame) {
            // console.log('Connected: ' + frame);
            $rootScope.$broadcast('stomp.connected');
        };
        var error_callback = function(error) {
            console.log('stomp connect error:', error);
        };
        _client.connect({
            // 'Authorization': 'Bearer super_token '
            'Authorization': 'Bearer ' + Session.getCredential().accessToken
        }, connect_callback, error_callback);
    })();

    return {
        isConnected: function() {
            return _client.connected || false;
        },
        subscribe: function(destination, callback, headers) {
            var subscription = _client.subscribe(destination, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(_client, args);
                });
            }, headers);
            subscriptions.push(subscription);
        },
        unsubscribeAll: function(destination) {
            subscriptions.forEach(function(s) {
                s.unsubscribe();
            });
            subscriptions = [];
        },
        send: function(destination, headers, body) {
            _client.send(destination, headers, body);
        },
        disconnect: function(callback) {
            _client.disconnect(function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(_client, args);
                });
            });
        }
    }
}]);