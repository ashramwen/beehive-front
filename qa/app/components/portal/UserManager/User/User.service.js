angular.module('BeehivePortal')
  .factory('UserService', ['$http', '$q', 'Session', function($http, $q, Session) {
    var userService = {};
    // TODO

    // TODO
    userService.getUserList = function(){
        return $http({
            url:MyAPIs.SEARCH_USER,
            method:'get',
            data:{}
        });
    };

    return userService;
  }]);
