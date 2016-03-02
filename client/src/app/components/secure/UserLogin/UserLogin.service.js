angular.module('BeehivePortal')
  .factory('UserLoginService', ['$http', '$q', 'Session', function($http, $q, Session) {
    var userLoginService = {};

    userLoginService.login = function(credentials){
        return $http({
            method:'POST',
            url: MyAPIs.LOGIN,
            data:credentials,
            transformRequest:{

            }
        });
    };

    return userLoginService;
  }]);
