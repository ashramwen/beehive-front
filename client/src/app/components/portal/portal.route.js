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
        stateName: '用户管理'
      })
      .state('app.portal.ScenarioManager', {
        url: '/ScenarioManager',
        templateUrl: 'app/components/portal/ScenarioManager/ScenarioManager.html',
        controller: 'ScenarioManagerController',
        abstract: true,
        stateName: '场景管理',
        redirectTo: 'app.portal.ScenarioManager.OfficeAtmosphere'
      })
      .state('app.portal.ThingManager', {
        url: '/ThingManager',
        templateUrl: 'app/components/portal/ThingManager/ThingManager.html',
        controller: 'ThingManagerController',
        redirectTo: 'app.portal.ThingManager.AddThing',
        abstract: true,
        stateName: '设备管理'
      })
      .state('app.portal.Settings', {
        url: '/Settings',
        templateUrl: 'app/components/portal/Settings/Settings.html',
        controller: 'SettingsController',
        stateName: '设置'
      })
      .state('app.portal.Reporting', {
        url: '/Reporting',
        templateUrl: 'app/components/portal/Reporting/Reporting.html',
        controller: 'ReportingController',
        redirectTo: 'app.portal.Reporting.LineChart',
        abstract: true,
        stateName: '数据报表'
      })
      .state('app.portal.Welcome', {
        url: '/Welcome',
        templateUrl: 'app/components/portal/Welcome/Welcome.html',
        controller: 'WelcomeController',
        stateName: '欢迎'
      })
      .state('app.portal.TriggerManager', {
        url: '/TriggerManager',
        templateUrl: 'app/components/portal/TriggerManager/TriggerManager.html',
        controller: 'TriggerManagerController',
        stateName: '触发器管理',
        abstract: true
      })
      .state('app.portal.ThingViews', {
        url: '/ThingViews',
        templateUrl: 'app/components/portal/ThingViews/ThingViews.html',
        controller: 'ThingViewsController',
        stateName: '设备视图',
        abstract: true,
        redirectTo: 'app.portal.ThingViews.LocationView'
      })
      .state('app.portal.MonitorManager', {
        url: '/MonitorManager',
        templateUrl: 'app/components/portal/MonitorManager/MonitorManager.html',
        // controller: 'MonitorManagerController',
        stateName: '设备监控',
        redirectTo: 'app.portal.MonitorManager.View'
      });
  });
