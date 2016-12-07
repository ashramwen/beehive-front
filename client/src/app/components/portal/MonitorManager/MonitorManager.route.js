'use strict';

angular.module('BeehivePortal.MonitorManager')

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.portal.MonitorManager.View', {
            url: '/',
            templateUrl: 'app/components/portal/MonitorManager/View/View.html',
            controller: 'ViewController',
            stateName: 'monitorManager.monitorView',
            previous: 'app.portal.MonitorManager'
        })
        .state('app.portal.MonitorManager.Monitoring', {
            url: '/{id:int}',
            templateUrl: 'app/components/portal/MonitorManager/Monitoring/Monitoring.html',
            controller: 'MonitoringController',
            stateName: 'monitorManager.realtime',
            previous: 'app.portal.MonitorManager.View',
            params: {
                'id': 0,
                'name': '',
                'desc': '',
                'count': 0
            }
        })
        .state('app.portal.MonitorManager.History', {
            url: '/{id}/History',
            templateUrl: 'app/components/portal/MonitorManager/History/History.html',
            controller: 'HistoryController',
            stateName: 'monitorManager.history',
            previous: 'app.portal.MonitorManager.Monitoring',
            params: {
                'id': ''
            }
        })
        .state('app.portal.MonitorManager.ViewManager', {
            url: '/{id:int}/Manage',
            templateUrl: 'app/components/portal/MonitorManager/ViewManager/ViewManager.html',
            controller: 'ViewManagerController',
            stateName: 'monitorManager.channelInfo',
            previous: 'app.portal.MonitorManager.View',
            params: {
                'id': 0,
                'name': '',
                'desc': '',
                'count': 0
            }
        })
        .state('app.portal.MonitorManager.New', {
            url: '/New',
            templateUrl: 'app/components/portal/MonitorManager/ViewManager/ViewManager.html',
            controller: 'ViewManagerController',
            stateName: 'monitorManager.channelInfo',
            previous: 'app.portal.MonitorManager.View'
        });
});