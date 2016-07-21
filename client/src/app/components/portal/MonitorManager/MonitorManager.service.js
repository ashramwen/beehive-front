angular.module('BeehivePortal.MonitorManager')

.factory('WebSocketClient', ['$rootScope', '$stomp', '$q', 'Session', '$$User', function($rootScope, $stomp, $q, Session, $$User) {
    // Open a WebSocket connection
    var WebSocketClient = {};

    var $defer = $q.defer();
    var connect_callback = function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/493e83c9/1086', function(frame) {
            console.log(frame.body);
        });
        // stompClient.subscribe('/topic/493e83c9/0807W-F02-15-118', function(frame) {
        //     console.log(frame.body);
        // });
    };
    var error_callback = function(error) {
        console.log(error);
    };
    // var ws = new SockJS(webSocketPath);
    var stompClient = Stomp.client(webSocketPath);
    // var stompClient = Stomp.client('ws://localhost:61613');
    // var stompClient = Stomp.over(ws);
    stompClient.connect({
        'Authorization': 'Bearer super_token '
        // 'Authorization': 'Bearer ' + Session.getCredential().accessToken
    }, connect_callback, error_callback);
    WebSocketClient.getClient = function() {

        // var headers = {
        //     Authorization: 'Bearer ' + $rootScope.credential.accessToken,
        //     'Content-type': 'application/json'
        // };

        // var client = Stomp.over(ws);

        // client.connect(headers, function() {

        //     client.subscribe('/topic/operator', function(frame) {
        //         $defer.resolve(client);
        //     }, function(e) {
        //         $defer.reject(e);
        //     });

        // }, function(e) {
        //     $defer.reject(e);
        // })();

        return $defer.promise;
    };

    return WebSocketClient;
}]);
