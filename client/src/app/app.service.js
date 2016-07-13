/*
 * By George Lin
 */

angular.module('BeehivePortal')
  .service('Session', ['localStorageService', 'AppUtils', '$http', '$rootScope', '$$Auth', '$$User', '$q', 'AUTH_EVENTS', function(localStorageService, AppUtils, $http, $rootScope, $$Auth, $$User, $q, AUTH_EVENTS) {
    var session = {};
    window.MyApp = window.MyApp || {};

    session.setCredential = function(credential){
        AppUtils.setSessionItem('credential', credential);
        $rootScope.credential = credential;
        window.MyApp.credential = credential;
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + credential['accessToken'];
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
                if(error.status != 403){
                    reject(AUTH_EVENTS.loginFailed);
                }else{
                    reject(AUTH_EVENTS.UnauthorizedException);
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
      $$Auth.logout(function(){
        AppUtils.clearSession();
        session._status = session.StatusType.UNKNOWN;
      });
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
  .factory('AppService', ['$http', '$q', 'Session', function($http, $q, Session) {
    var appService = {};
    // TODO

    return appService;
  }]);

