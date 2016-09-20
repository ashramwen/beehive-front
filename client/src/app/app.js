'use strict'

var MyApp = angular.module('BeehivePortal', [
  'BeehivePortal.MonitorManager',
  'ngAnimate', 'ngCookies', 'ngSanitize',
  'ngResource', 'ui.router', 'ui.bootstrap','LocalStorageModule', 'rzModule', 'treeControl', 'ngStomp', 'datePicker',
  'monospaced.elastic', 'angularjs-dropdown-multiselect', 'ng.jsoneditor',
  'angular-cron-jobs', 'ui-notification', 'gridster', 'pascalprecht.translate', 'ui.timepicker'
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
  notAuthenticated: 'LOGIN_TOKEN_INVALID',
  notAuthorized: 'auth-not-authorized',
}).
config(function(localStorageServiceProvider, $httpProvider, NotificationProvider, $translateProvider) {
  localStorageServiceProvider
    .setPrefix("epgApp")
    .setStorageType('localStorage')
    .setStorageCookie(30, '/')
    .setNotify(true, true);

    var requestCount = 0;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];

    $translateProvider
      .translations('en', window.translations.en)
      .translations('cn', window.translations.cn)
      .preferredLanguage('cn');

    $httpProvider.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
    $httpProvider.interceptors.push(function($q, AUTH_EVENTS, ERROR_CODE) {
      return {
        request: function(request) {
            window.app.utils.doLoading();
            return request;
        },
        response: function(response){
            window.app.utils.whenLoaded();
            return response;
        },
        responseError: function(response){
            window.app.utils.whenLoaded();
            $('#spinner').hide();
            switch(response.status){
                case 401:
                    if(!response.data.errorCode == ERROR_CODE.INVALID_TOKEN){
                      window.AppUtils.alert({
                        msg: 'app.UNAUTHORIZED_MSG'
                      });
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
          window.ECharts = echarts;
          _.noConflict();
          
          KiiReporting.KiiQueryConfig.setConfig({
            site: 'http://121.199.7.69',
            port: 9200,
            timeStampField: 'state.date',
            chartOptions: {
              _backButton: {
                style: {
                  position: 'absolute',
                  top: '-10px',
                  left: '10px'
                },
                cssClass: "btn btn-warning",
                text: '返回'
              },
              color: ['#ffa976', '#f88dc7', '#9ae05a', '#53d9db', '#9ee6f6', '#ecc475', '#7abce2', '#dee27a', '#927ae2', '#7ae2c3', '#ffdcc7', '#7986CB', '#B0BEC5', '#8D6E63', '#BA68C8', '#FF7043']
            }
          });
          
          $rootScope.$on('$stateChangeStart', function(evt, to, params) {
            if (to.redirectTo) {
              evt.preventDefault();
              $state.go(to.redirectTo, params, {location: 'replace'})
            }
          });
      }
  ]
);

angular.module('ui.timepicker').value('uiTimepickerConfig',{
  step: 15,
  timeFormat: 'H:i',
  show2400: true,
  appendTo: 'body'
});
