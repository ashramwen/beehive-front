'use strict';

angular.module('BeehivePortal')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.portal.TriggerManager.TriggerList', {
        url: '/TriggerList',
        templateUrl: 'app/components/portal/TriggerManager/TriggerList/TriggerList.html',
        controller: 'TriggerListController',
        stateName: 'triggerManager.triggerList'
      })
      .state('app.portal.TriggerManager.NewTrigger', {
        url: '/NewTrigger',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerDetail.html',
        controller: 'TriggerDetailController',
        stateName: 'triggerManager.triggerDetail',
        previous: 'app.portal.TriggerManager.TriggerList',
        abstract: true
      })
      .state('app.portal.TriggerManager.TriggerDetail', {
        url: '/Triggers/:triggerID',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/TriggerDetail.html',
        controller: 'TriggerDetailController',
        stateName: 'triggerManager.triggerDetail',
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
        stateName: 'triggerManager.newTrigger',
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
        stateName: 'triggerManager.newScheduleTrigger',
        previous: 'app.portal.TriggerManager.TriggerList'
      })
      /**
       * condition trigger detail
       * @type {String}
       */
      .state('app.portal.TriggerManager.TriggerDetail.ConditionTrigger', {
        url: '/ConditionTrigger',
        templateUrl: 'app/components/portal/TriggerManager/TriggerDetail/ConditionTriggerDetail/ConditionTriggerDetail.html',
        controller: 'ConditionTriggerDetailController',
        stateName: 'triggerManager.conditionTriggerDetail',
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
        stateName: 'triggerManager.scheduleTriggerDetail',
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
        stateName: 'triggerManager.editAction',
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
        stateName: 'triggerManager.editCondition',
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
        stateName: 'triggerManager.editAction',
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
        stateName: 'triggerManager.editCondition',
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
        stateName: 'triggerManager.editAction',
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
        stateName: 'triggerManager.editAction',
        previous: 'app.portal.TriggerManager.NewTrigger.ScheduleTrigger'
      });
  });
