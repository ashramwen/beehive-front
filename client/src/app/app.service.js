/*
 * By George Lin
 */
/*
 * By George Lin
 */

angular.module('BeehivePortal')
  .service('Session', ['localStorageService', 'AppUtils', function(localStorageService, AppUtils) {
    var session = {};

    session.AuthenInfo = {
      header:{
        token: 'aefsgfaefa'
      }
    };

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
    };

    /*
     * get current user
     */
    session.currentUser = function() {
      return localStorageService.get(AppTags.USER);
    }
    session.getStatus = function(){
        return session._status;
    }
    session.isAuthen = function(){
        return session._status == session.StatusType.SIGNEDIN;
    }

    return session;
  }]);


angular.module('BeehivePortal')
  .factory('AppService', ['$http', '$q', 'Session', function($http, $q, Session) {
    var appService = {};
    // TODO

    return appService;
  }]);
