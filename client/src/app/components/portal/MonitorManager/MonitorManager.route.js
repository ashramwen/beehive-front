'use strict';

angular.module('BeehivePortal.MonitorManager')

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.portal.MonitorManager.Monitoring', {
            url: '/Monitoring',
            templateUrl: 'app/components/portal/MonitorManager/Monitoring/Monitoring.html',
            controller: 'MonitoringController',
            stateName: '实时监控',
            previous: 'app.portal.MonitorManager.View',
            params: {
                'id': 0,
                'name': '',
                'desc': '',
                'count': 0
            }
        })
        .state('app.portal.MonitorManager.View', {
            url: '/View',
            templateUrl: 'app/components/portal/MonitorManager/View/View.html',
            controller: 'ViewController',
            stateName: '监控视图',
            previous: 'app.portal.MonitorManager'
        })
        .state('app.portal.MonitorManager.ViewManager', {
            url: '/ViewManager',
            templateUrl: 'app/components/portal/MonitorManager/ViewManager/ViewManager.html',
            controller: 'ViewManagerController',
            stateName: '频道信息',
            previous: 'app.portal.MonitorManager.View',
            params: {
                'id': 0,
                'name': '',
                'desc': '',
                'count': 0
            }
        });
});
