angular.module('BeehivePortal')
  .factory('UserLoginService', ['$http', '$q', 'Session', function($http, $q, Session) {
    var userLoginService = {};

    userLoginService.login = function(credentials){
        return $http({
            method:'get',
            url: MyAPIs.LOGIN,
            data:credentials,
            header:{
                dataType:'json',
                contentType:'application/json; charset=utf-8'
            },
            transformRequest:{

            }
        });
    };

    return userLoginService;
  }]);
