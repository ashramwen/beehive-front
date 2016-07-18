'use strict'

var MyApp = angular.module('BeehivePortal', [
  'BeehivePortal.ScenarioManager',
  'BeehivePortal.MonitorManager',
  'ngAnimate', 'ngCookies', 'ngSanitize',
  'ngResource', 'ui.router', 'ui.bootstrap','LocalStorageModule', 'rzModule', 'treeControl', 'ngStomp',
  'angular-condition-tree', 'awesome-context-menu', 'monospaced.elastic', 'angularjs-dropdown-multiselect', 'ng.jsoneditor',
  'angular-cron-jobs', 'ui-notification'
])
.constant('ERROR_CODE', {
  'INVALID_INPUT': 'INVALID_INPUT',
  'INVALID_TOKEN': 'INVALID_TOKEN'
})
.constant('AUTH_EVENTS', {
  tokenNotGiven: 'token-not-given',
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'UnauthorizedException',
  notAuthorized: 'auth-not-authorized',
}).
config(function(localStorageServiceProvider, $httpProvider, NotificationProvider) {
  localStorageServiceProvider
    .setPrefix("epgApp")
    .setStorageType('localStorage')
    .setStorageCookie(30, '/')
    .setNotify(true, true);

    var requestCount = 0;
    //$httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];

    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
    $httpProvider.interceptors.push(function($q, AUTH_EVENTS, ERROR_CODE) {
      return {
        request: function(request) {
            $('#spinner').show();
            requestCount++;
            return request;
        },
        response: function(response){
          hideLoading();
          return response;
        },
        responseError: function(response){
            hideLoading();
            $('#spinner').hide();
            switch(response.status){
                case 401:
                    if(!response.data.errorCode == ERROR_CODE.INVALID_TOKEN){
                      window.alertMessage('您没有相应的操作权限。');
                    }

                    break;
                case 500:
                    switch(response.data.errorCode){
                        case AUTH_EVENTS.notAuthenticated:
                            window.location = '#/';
                            break;
                    }
                    break;
            }
            return $q.reject(response);
        }
      };
    });


    NotificationProvider.setOptions({
      delay: 10000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'top'
    });

    /*
     * hide loading
     */
    function hideLoading(){
      requestCount--;
      if(requestCount==0){
        $('#spinner').hide();
      }
    }

}).run(
  ['$rootScope', '$state', '$stateParams', 'AppUtils',
      function($rootScope, $state, $stateParams, AppUtils) {

          // It's very handy to add references to $state and $stateParams to the $rootScope
          // so that you can access them from any scope within your applications.For example,
          // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
          // to active whenever 'contacts.list' or one of its decendents is active.
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
          window.state = $state;
          /* =======================================================
           * =======================================================
           * init AppUtils
           * =======================================================
           * =======================================================
           */
          AppUtils.initialize();
          window.AppUtils = AppUtils;

          $rootScope.$on('$stateChangeStart', function(evt, to, params) {
            if (to.redirectTo) {
              evt.preventDefault();
              $state.go(to.redirectTo, params, {location: 'replace'})
            }
          });
      }
  ]
);
