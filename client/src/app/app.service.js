/*
 * By George Lin
 */

angular.module('BeehivePortal')
  .service('Session', ['localStorageService', 'AppUtils', '$http', '$rootScope', '$$Auth', '$$User', '$q', 'AUTH_EVENTS', '$cacheFactory', '$rootScope', function(localStorageService, AppUtils, $http, $rootScope, $$Auth, $$User, $q, AUTH_EVENTS, $cacheFactory, $rootScope) {
    var session = {};
    window.MyApp = window.MyApp || {};

    session.setCredential = function(credential){
        AppUtils.setSessionItem('credential', credential);
        $rootScope.credential = credential;
        window.MyApp.credential = credential;
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + credential['accessToken'];
        KiiReporting.KiiQueryConfig.setConfig({
            token: 'Bearer ' + credential['accessToken']
        });
    };

    session.useCredential = function(){
        var credential = AppUtils.getSessionItem('credential');
        return $q(function(resolve, reject){
            if(!credential){
                reject(AUTH_EVENTS.tokenNotGiven);
                return;
            }
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + credential['accessToken'];
            $$User.get(function(){
                session.setCredential(credential);
                resolve(credential);
                $rootScope.login = true;
            }, function(error){
                switch(error.status){
                    case 401:
                    case 403:
                        reject(AUTH_EVENTS.UnauthorizedException);
                        return;
                    default: 
                        reject(AUTH_EVENTS.loginFailed);
                }
            });
        });
    };

    session.getCredential = function(){
        return AppUtils.getSessionItem('credential');
    };


    window.MyApp.credential = session.getCredential();

    session.StatusType = {
        SIGNEDIN: 'loggedin',
        TIMEOUT: 'timeout',
        UNKNOWN: 'unknon'
    };

    session._status = session.StatusType.UNKNOWN;

    /*
     * Set current user after login
     */
    session.setUser = function(user) {
      AppUtils.setSessionItem(AppTags.USER, user);
      session._status = session.StatusType.SIGNEDIN;
    };

    /*
     * destroy user session when user session is abondoned
     */
    session.destroy = function() {
      AppUtils.clearSession();
      session._status = session.StatusType.UNKNOWN;
      var httpCache = $cacheFactory.get('$http');
      httpCache.removeAll();
      $rootScope.login = false;

      $$Auth.logout(function(){});
    };

    /*
     * get current user
     */
    session.currentUser = function() {
      return localStorageService.get(AppTags.USER);
    };
    session.getStatus = function(){
        return session._status;
    };
    session.isAuthen = function(){
        return session._status == session.StatusType.SIGNEDIN;
    };

    return session;
  }]);

angular.module('BeehivePortal')
  .factory('AppService', ['$http', '$q', 'Session', '$$Type', '$$Location', '$cacheFactory', function($http, $q, Session, $$Type, $$Location, $cacheFactory) {
    var appService = {};
    
    appService.lazyLoad = function(){
        appService._loadTypes();
        appService._loadLocation();
    };

    appService._loadTypes = function(){
        $$Type.getAll(function(types){
            _.each(types, function(type){
                $$Type.getSchema({type: type.type});
            });
        });
    };

    
    appService._loadLocation = function(){
        var $httpDefaultCache = $cacheFactory.get('$http');
        

        $$Location.queryAll(function(res){
            var topLevels = retrieval(res);
            putCache(MyAPIs.LOCATION_TAGS + '/topLevel', topLevels);
        });
        

        function retrieval(location){
            var subLevels = _.map(location.subLocations, function(subLocation, key){
                return {
                    "location": key,
                    "displayName": key,
                    "subLocations": subLocation.subLocations,
                    "level": subLocation.locationLevel,
                    "parent": subLocation.location
                };
            });
            putCache(MyAPIs.LOCATION_TAGS + '/' + location.location + '/subLevel', subLevels);
            _.each(location.subLocations, function(subLocation){
                retrieval(subLocation);
            });
            return subLevels;
        }

        function putCache(url, obj){
            var r = [
                200,
                JSON.stringify(obj), 
                {'content-type': "application/json;charset=UTF-8"},
                'OK'
            ];

            $httpDefaultCache.put(url, r);
        }

    };
    

    return appService;
  }]);

