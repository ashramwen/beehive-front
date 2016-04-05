/*
 * By George Lin
 */

angular.module('BeehivePortal')
  .service('Session', ['localStorageService', 'AppUtils', '$http', '$rootScope', function(localStorageService, AppUtils, $http, $rootScope) {
    var session = {};
    window.MyApp = window.MyApp || {};

    session.setCredential = function(credential){
        AppUtils.setSessionItem('credential', credential);
        session.useCredential();
    };

    session.useCredential = function(){
        var credential = AppUtils.getSessionItem('credential');
        if(credential){
          $rootScope.credential = credential;
          window.MyApp.credential = credential;
          $http.defaults.headers.common['Authorization'] = 'Bearer ' + credential['accessToken'];
        }
    }

    session.getCredential = function(){
        return AppUtils.getSessionItem('credential');
    }

    
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
