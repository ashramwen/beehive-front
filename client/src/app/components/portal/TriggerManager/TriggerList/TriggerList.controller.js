'use strict';

angular.module('BeehivePortal')
  .controller('TriggerListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$$Tag', '$q', '$timeout', '$uibModal', '$$Location', '$$Trigger', 
    function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type,$$Tag, $q, $timeout, $uibModal, $$Location, $$Trigger) {
    
    /**
     * init args
     */
    
    $scope.triggers = [];
    $scope.typeList = [
        {name: 'conditional', displayName: '条件规则', disabled: false, icon:'fa-clock-o'},
        {name: 'schedule', displayName: '定时规则', disabled: false, icon:'fa-code-fork'}
    ];

    $rootScope.$watch('login', function(newVal){
      if(newVal){
        $scope.init();
      }
    });


    $scope.init = function(){
        $$Trigger.getAll(function(triggers){
            $scope.triggers = _.map(triggers, function(trigger){
                return {
                    triggerID: trigger.triggerID,
                    name: trigger.name,
                    description: trigger.description,
                    disabled: trigger.recordStatus == 'disable',
                    type: (!!trigger.predicate.schedule)? 'schedule': 'conditional',
                    createdAt: '2016-07-06',
                    fromGateway: trigger.type == 'gateway'
                };
            });
        });
    };

    $scope.viewTrigger = function(trigger){
        var params = _.extend({triggerID: trigger.triggerID}, $state.params);
        switch(trigger.type){
            case 'schedule':
                $state.go('app.portal.TriggerManager.TriggerDetail.ScheduleTrigger', params);
                break;
            case 'conditional':
                $state.go('app.portal.TriggerManager.TriggerDetail.ConditionTrigger', params);
                break;
        }
    };

    $scope.getTriggerClass = function(trigger){
        if(trigger.disabled) return 'disabled';
        return trigger.type;
    };

    $scope.createScheduleTrigger = function(){
        $state.go('app.portal.TriggerManager.NewTrigger.ScheduleTrigger');
    };

    $scope.createConditionalTrigger = function(){
        $state.go('app.portal.TriggerManager.NewTrigger.ConditionTrigger');
    };

    $scope.toggleType = function(type){
        type.disabled = !type.disabled;
    }

    /**
     * delete trigger
     * @return {[type]} [description]
     */
    $scope.deleteTrigger = function(trigger){
        if(trigger.triggerID){
            $$Trigger.remove({}, trigger, function(){
                $scope.triggers.remove(trigger);
            });
        }else{
            $scope.triggers.remove(trigger);
        }
    };

    /**
     * enable trigger
     * @return {[type]} [description]
     */
    $scope.enableTrigger = function(trigger){
        $$Trigger.enable({}, trigger, function(){
            trigger.enable();
        });
    };

    /**
     * disable trigger
     * @return {[type]} [description]
     */
    $scope.disableTrigger = function(trigger){
        $$Trigger.disable({}, trigger, function(){
            trigger.disable();
        });
    };

    $scope.$on('deleteTrigger', function(e, trigger){
        AppUtils.confirm('提示信息', '您确定要删除这个触发器吗？', function(){
            $scope.deleteTrigger(trigger);
        }); 
    });

    $scope.$on('enableTrigger', function(e, trigger){
        AppUtils.confirm('提示信息', '您确定要启用这个触发器吗？', function(){
            $scope.enableTrigger(trigger);
        }); 
    });

    $scope.$on('disableTrigger', function(e, trigger){
        AppUtils.confirm('提示信息', '您确定要禁用这个触发器吗？', function(){
            $scope.disableTrigger(trigger);
        }); 
    });

    $scope.triggerFilter = function(trigger){
        if(!$scope.showDisabled && trigger.disabled){
            return false;
        }
        return _.find($scope.typeList, {name: trigger.type});
    };
    
  }]);
