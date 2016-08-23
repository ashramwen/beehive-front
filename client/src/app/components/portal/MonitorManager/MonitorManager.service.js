angular.module('BeehivePortal.MonitorManager')

.factory('ThingSchemaService', ['$$Type', 'TriggerDetailService', '$q', function($$Type, TriggerDetailService, $q) {
    var typeList = [];
    var schemaList = [];

    var dirtyFields = ['target', 'taiwanNo1', 'novalue'];

    function displayName(thing, schema) {
        thing.actions = schema.actions;
        thing.typeDisplayName = schema.displayName;

        var properties = schema.properties;
        for (var key in thing.status) {
            if (dirtyFields.indexOf(key) > -1)
                delete thing.status[key];
        }
        thing.status = _.map(thing.status, function(value, key) {
            if (dirtyFields.indexOf(key) === -1) {
                var property = _.find(properties, { propertyName: key });
                return {
                    name: key,
                    displayName: property ? property.displayName : key,
                    value: value
                };
            }
        });
    }

    return {
        getSchema: function(things) {
            var $defer = $q.defer();
            var promiseList = [];
            var _index = -1;
            _.each(things, function(thing) {
                _index = _.indexOf(typeList, thing.type);
                if (_index > -1) return;
                typeList.push(thing.type);
                var $promise = $$Type.getSchema({ type: thing.type }, function(schema) {
                    var _schema = TriggerDetailService.parseSchema(schema)
                    schemaList.push(_schema);

                }).$promise;
                promiseList.push($promise);
            });
            $q.all(promiseList).then(function() {
                var _index = 0;
                _.each(things, function(thing) {
                    _index = _.indexOf(typeList, thing.type);
                    displayName(thing, schemaList[_index]);
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
        }
    }
}])

.factory('WebSocketClient', ['$rootScope', 'Session', function($rootScope, Session) {
    var _client = {};
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
            _client.subscribe(destination, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(_client, args);
                });
            }, headers);
        },
        unsubscribe: function(destination) {
            _client.unsubscribe(destination);
        },
        unsubscribeAll: function(destination) {
            var i = 0;
            for (; i < _client.subscriptions.length; i++) {
                _client.subscriptions[i].unsubscribe();
            }
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