angular.module('BeehivePortal')
  .factory('UserService', ['$http', '$q', 'Session', function($http, $q, Session) {
    var userService = {};
    // TODO
    userService.getUserList = function(){
        return $http({
            url:MyAPIs.SEARCH_USER,
            method:'get',
            data:{},
            header: Session.AuthenInfo.header
        });
    };

    userService.getUser = function(){
        return $http({
            url: 'app/data/user.json',
            method: 'get'
        });
    }

    return userService;
  }]);
