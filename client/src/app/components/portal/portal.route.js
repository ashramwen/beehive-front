'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.UserManager', {
        url: '/UserManager',
        templateUrl: 'app/components/portal/UserManager/UserManager.html',
        controller: 'UserManagerController',
        redirectTo: 'app.portal.UserManager.User.UserList',
        abstract: true,
        stateName: 'userManager'
      })
      .state('app.portal.ThingManager', {
        url: '/ThingManager',
        templateUrl: 'app/components/portal/ThingManager/ThingManager.html',
        controller: 'ThingManagerController',
        redirectTo: 'app.portal.ThingManager.AddThing',
        abstract: true,
        stateName: 'thingManager'
      })
      .state('app.portal.Settings', {
        url: '/Settings',
        templateUrl: 'app/components/portal/Settings/Settings.html',
        controller: 'SettingsController',
        stateName: 'settings'
      })
      .state('app.portal.Reporting', {
        url: '/Reporting',
        templateUrl: 'app/components/portal/Reporting/Reporting.html',
        controller: 'ReportingController',
        redirectTo: 'app.portal.Reporting.LineChart',
        abstract: true,
        stateName: 'reporting'
      })
      .state('app.portal.Welcome', {
        url: '/Welcome',
        templateUrl: 'app/components/portal/Welcome/Welcome.html',
        controller: 'WelcomeController',
        stateName: 'welcome'
      })
      .state('app.portal.TriggerManager', {
        url: '/TriggerManager',
        templateUrl: 'app/components/portal/TriggerManager/TriggerManager.html',
        controller: 'TriggerManagerController',
        stateName: 'triggerManager',
        abstract: true
      })
      .state('app.portal.ThingViews', {
        url: '/ThingViews',
        templateUrl: 'app/components/portal/ThingViews/ThingViews.html',
        controller: 'ThingViewsController',
        stateName: 'thingViews',
        abstract: true,
        redirectTo: 'app.portal.ThingViews.TypeView'
      })
      .state('app.portal.MonitorManager', {
        url: '/MonitorManager',
        templateUrl: 'app/components/portal/MonitorManager/MonitorManager.html',
        // controller: 'MonitorManagerController',
        stateName: 'monitorManager',
        redirectTo: 'app.portal.MonitorManager.View'
      });
  });
