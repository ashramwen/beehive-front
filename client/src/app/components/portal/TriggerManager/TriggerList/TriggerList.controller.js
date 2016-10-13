'use strict';

angular.module('BeehivePortal')
  .controller('TriggerListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$$Tag', '$q', '$timeout', '$uibModal', '$$Location', '$$Trigger', 'MachineLearningTriggerDetailService',
    function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type,$$Tag, $q, $timeout, $uibModal, $$Location, $$Trigger, MachineLearningTriggerDetailService) {
    
    /**
     * init args
     */
    
    $scope.triggers = [];
    $scope.typeList = [
        {name: 'conditional', displayName: 'triggerManager.conditionRule', disabled: false, icon:'fa-code-fork'},
        {name: 'schedule', displayName: 'triggerManager.scheduleRule', disabled: false, icon:'fa-clock-o'},
        {name: 'machine-learning', displayName: 'triggerManager.machineLearningRule', disabled: false, icon: 'fa-puzzle-piece'}
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
                    type: $scope.getTriggerType(trigger),
                    createDate: trigger.createDate,
                    fromGateway: trigger.type == 'Gateway'
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
            case 'machine-learning':
                $state.go('app.portal.TriggerManager.TriggerDetail.MachineLearningTrigger', params);
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

    $scope.createMachineLearning = function(){
        $state.go('app.portal.TriggerManager.NewTrigger.MachineLearningTrigger');
    }

    $scope.toggleType = function(type){
        type.disabled = !type.disabled;
    }

    /**
     * delete trigger
     * @return {[type]} [description]
     */
    $scope.deleteTrigger = function(trigger){
        var confirm = function(){
            if(trigger.triggerID){
                $$Trigger.remove({triggerID: trigger.triggerID}, function(){
                    $scope.triggers.remove(trigger);
                    if(trigger.type == 'machine-learning'){
                        MachineLearningTriggerDetailService.cleanUp(trigger);
                    }
                });
            }else{
                $scope.triggers.remove(trigger);
            }
        };

        var options = {
            msg: 'triggerManager.deleteTriggerMsg',
            callback: confirm
        };

        AppUtils.confirm(options); 
    };

    $scope.getTriggerType = function(trigger){
        if(trigger.description.indexOf('"type":"MachineLearning"') > -1) return 'machine-learning';
        return (!!trigger.predicate.schedule)? 'schedule': 'conditional';
    };

    $scope.triggerFilter = function(trigger){
        if(!$scope.showDisabled && trigger.disabled){
            return false;
        }
        return _.find($scope.typeList, {name: trigger.type, disabled: false});
    };
    
  }]);
