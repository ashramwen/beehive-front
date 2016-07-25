angular.module('BeehivePortal.MonitorManager')

.factory('WebSocketClient', ['$rootScope', '$stomp', '$q', 'Session', '$$User', function($rootScope, $stomp, $q, Session, $$User) {
    var client = Stomp.client(webSocketPath);
    client.init = function() {
        var $defer = $q.defer();
        if (client.connected) {
            $defer.resolve();
        } else {
            var connect_callback = function(frame) {
                console.log('Connected: ' + frame);
                $defer.resolve();
            };
            var error_callback = function(error) {
                console.log(error);
                $defer.reject();
            };
            client.connect({
                'Authorization': 'Bearer super_token '
                // 'Authorization': 'Bearer ' + Session.getCredential().accessToken
            }, connect_callback, error_callback);
        }
        return $defer.promise;
    };
    // client.init();
    return client;
}]);
