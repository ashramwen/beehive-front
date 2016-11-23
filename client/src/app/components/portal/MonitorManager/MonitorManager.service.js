angular.module('BeehivePortal.MonitorManager')

.factory('ThingSchemaService', ['$$Schema', 'TriggerDetailService', '$q', function($$Schema, TriggerDetailService, $q) {
    var typeList = [];
    var schemaList = [];

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

    return {
        getSchema: function(things) {
            var $defer = $q.defer();
            var promiseList = [];
            things.forEach(function(thing) {
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
                _.each(things, function(thing) {
                    schema = _.findWhere(schemaList, { name: thing.schemaName });
                    displayName(thing, schema);
                });
                $defer.resolve(schemaList);
            });

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

    return {
        getSchema: function(things) {
            var $defer = $q.defer();
            $defer.resolve({});

            return $defer.promise;
        }
    }
}])

.factory('WebSocketClient', ['$rootScope', 'Session', function($rootScope, Session) {
    var _client = {};
    var subscriptions = [];
    var init = (function() {
        _client = Stomp.client(webSocketPath);
        var connect_callback = function(frame) {
            console.log('Connected: ' + frame);
            $rootScope.$broadcast('stomp.connected');
        };
        var error_callback = function(error) {
            console.log(error);
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
        // unsubscribe: function(destination) {
        //     _client.unsubscribe(destination);
        // },
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