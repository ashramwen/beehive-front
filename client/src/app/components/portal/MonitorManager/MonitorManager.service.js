angular.module('BeehivePortal.MonitorManager')

.factory('WebSocketClient', ['$rootScope', '$stomp', '$q', 'Session', '$$User', function($rootScope, $stomp, $q, Session, $$User) {
    var _client = {};
    var init = (function() {
        _client = Stomp.client(webSocketPath);
        var connect_callback = function(frame) {
            console.log('Connected: ' + frame);
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
