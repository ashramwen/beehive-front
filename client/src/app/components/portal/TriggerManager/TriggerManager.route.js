'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.TriggerManager.TriggerList', {
        url: '/TriggerList',
        templateUrl: 'app/components/portal/TriggerManager/TriggerList/TriggerList.html',
        controller: 'TriggerListController',
        stateName: '触发器列表'
      })
      .state('app.portal.TriggerManager.NewTrigger', {
        url: '/NewTrigger',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerDetail.html',
        controller: 'TriggerDetailController',
        stateName: '触发器详情',
        previous: 'app.portal.TriggerManager.TriggerList',
        abstract: true
      })
      .state('app.portal.TriggerManager.TriggerDetail', {
        url: '/Triggers/:triggerID',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerDetail.html',
        controller: 'TriggerDetailController',
        stateName: '触发器详情',
        previous: 'app.portal.TriggerManager.TriggerList',
        abstract: true
      })
      /**
       * new condition trigger
       * @type {String}
       */
      .state('app.portal.TriggerManager.NewTrigger.ConditionTrigger', {
        url: '/ConditionTrigger',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/ConditionTriggerDetail/ConditionTriggerDetail.html',
        controller: 'ConditionTriggerDetailController',
        stateName: '新建条件规则',
        previous: 'app.portal.TriggerManager.TriggerList'
      })
      /**
       * new schedule trigger
       * @type {String}
       */
      .state('app.portal.TriggerManager.NewTrigger.ScheduleTrigger', {
        url: '/ScheduleTrigger',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/ScheduleTriggerDetail/ScheduleTriggerDetail.html',
        controller: 'ScheduleTriggerDetailController',
        stateName: '新建定时规则',
        previous: 'app.portal.TriggerManager.TriggerList'
      })
      /**
       * condition trigger detail
       * @type {String}
       */
      .state('app.portal.TriggerManager.TriggerDetail.ConditionTrigger', {
        url: '/ConditionTrigger',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/ConditionTriggerDetail/ConditionTriggerDetail.html',
        controller: 'ScheduleTriggerDetailController',
        stateName: '条件规则详情',
        previous: 'app.portal.TriggerManager.TriggerList'
      })
      /**
       * schedule trigger detail
       * @type {String}
       */
      .state('app.portal.TriggerManager.TriggerDetail.ScheduleTrigger', {
        url: '/ScheduleTrigger',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/ScheduleTriggerDetail/ScheduleTriggerDetail.html',
        controller: 'ScheduleTriggerDetailController',
        stateName: '定时规则详情',
        previous: 'app.portal.TriggerManager.TriggerList'
      })

      /**
       * action settings - condition trigger
       * @type {String}
       */
      .state('app.portal.TriggerManager.TriggerDetail.ConditionTriggerActionHandler', {
        url: '/Condition/action/:type',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerActionHandler/TriggerActionHandler.html',
        controller: 'TriggerActionHandlerController',
        stateName: '编辑行为',
        previous: 'app.portal.TriggerManager.TriggerDetail.ConditionTrigger'
      })
      /**
       * condition settings - condition trigger
       * @type {String}
       */
      .state('app.portal.TriggerManager.TriggerDetail.ConditionTriggerConditionHandler', {
        url: '/Condition/condition/:type',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerConditionHandler/TriggerConditionHandler.html',
        controller: 'TriggerConditionHandlerController',
        stateName: '编辑条件',
        previous: 'app.portal.TriggerManager.TriggerDetail.ConditionTrigger'
      })
      /**
       * action settings - new condition trigger
       * @type {String}
       */
      .state('app.portal.TriggerManager.NewTrigger.ConditionTriggerActionHandler', {
        url: '/Condition/action/:type',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerActionHandler/TriggerActionHandler.html',
        controller: 'TriggerActionHandlerController',
        stateName: '新建行为',
        previous: 'app.portal.TriggerManager.NewTrigger.ConditionTrigger'
      })
      /**
       * condition settings - new condition trigger
       * @type {String}
       */
      .state('app.portal.TriggerManager.NewTrigger.ConditionTriggerConditionHandler', {
        url: '/Condition/condition/:type',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerConditionHandler/TriggerConditionHandler.html',
        controller: 'TriggerConditionHandlerController',
        stateName: '编辑条件',
        previous: 'app.portal.TriggerManager.NewTrigger.ConditionTrigger'
      })
      /**
       * action settings - schedule trigger
       * @type {String}
       */
      .state('app.portal.TriggerManager.TriggerDetail.ScheduleTriggerActionHandler', {
        url: '/Schedule/action/:type',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerActionHandler/TriggerActionHandler.html',
        controller: 'TriggerActionHandlerController',
        previous: 'app.portal.TriggerManager.TriggerDetail.ScheduleTrigger'
      })
      /**
       * action settings - new schedule trigger
       * @type {String}
       */
      .state('app.portal.TriggerManager.NewTrigger.ScheduleTriggerActionHandler', {
        url: '/Schedule/action/:type',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerActionHandler/TriggerActionHandler.html',
        controller: 'TriggerActionHandlerController',
        previous: 'app.portal.TriggerManager.NewTrigger.ScheduleTrigger'
      });
  });
