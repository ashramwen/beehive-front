'use strict'

var MyApp = angular.module('BeehivePortal', ['ngAnimate', 'ngCookies', 'ngSanitize',
  'ngResource', 'ui.router', 'ui.bootstrap','LocalStorageModule', 'rzModule', 'treeControl', 
  'angular-condition-tree', 'awesome-context-menu', 'monospaced.elastic', 'angularjs-dropdown-multiselect', 'ng.jsoneditor',
  'angular-cron-jobs'
]).
constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized',
}).
config(function(localStorageServiceProvider, $httpProvider) {
  localStorageServiceProvider
    .setPrefix("epgApp")
    .setStorageType('localStorage')
    .setStorageCookie(30, '/')
    .setNotify(true, true);

    var requestCount = 0;
    //$httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];

    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
    $httpProvider.defaults.headers.common['Authorization'] = 'Bearer d31032a0-8ebf-11e5-9560-00163e02138f';
    $httpProvider.interceptors.push(function($q) {
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
            if(response.status == 401){
              window.alertMessage('您没有相应的操作权限。');
              //window.location = 'index.html#/app/secure/UserLogin';
            }
            return $q.reject(response);
        }
      };
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
      }
  ]
);
