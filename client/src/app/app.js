'use strict'

angular.module('BeehivePortal', ['ngAnimate', 'ngCookies', 'ngSanitize',
  'ngResource', 'ui.router', 'ui.bootstrap','LocalStorageModule'
]).
constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
}).
config(function(localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix("epgApp")
    .setStorageType('localStorage')
    .setStorageCookie(30, '/')
    .setNotify(true, true);
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
