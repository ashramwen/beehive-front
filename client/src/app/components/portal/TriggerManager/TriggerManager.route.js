'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.TriggerManager.TriggerDetail', {
        url: '/Triggers/:triggerID',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerDetail.html',
        controller: 'TriggerDetailController',
        stateName: '触发器详情',
        previous: 'app.portal.TriggerManager.TriggerList'
      })
      .state('app.portal.TriggerManager.TriggerList', {
        url: '/TriggerList',
        templateUrl: 'app/components/portal/TriggerManager/TriggerList/TriggerList.html',
        controller: 'TriggerListController',
        stateName: '触发器列表'
      })
      .state('app.portal.TriggerManager.NewTrigger', {
        url: '/NewTrigger',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerDetail.html',
        controller: 'CreateTriggerController',
        stateName: '新建触发器',
        previous: 'app.portal.TriggerManager.TriggerList'
      });
  });
