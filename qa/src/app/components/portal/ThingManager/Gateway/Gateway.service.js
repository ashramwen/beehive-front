
angular.module('BeehivePortal')
  .factory('WebSocketClient', ['$rootScope', '$stomp', '$q', function($rootScope, $stomp, $q){
    // Open a WebSocket connection
    var WebSocketClient = {};


    WebSocketClient.getClient = function(){

      var $defer = $q.defer();

      var ws = new SockJS(webSocketPath);

      var headers = {
        Authorization: 'Bearer ' + $rootScope.credential.accessToken, 
        "Content-type": "application/json"
      };

      var client = Stomp.over(ws);

      client.connect(headers, function(){

        client.subscribe('/topic/operator', function(frame) {
          $defer.resolve(client);
        }, function(e){
          $defer.reject(e);
        });
        
      }, function(e){
        $defer.reject(e);
      })();

      return $defer.promise;
    };

    return WebSocketClient;
  }]);