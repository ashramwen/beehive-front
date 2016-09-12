'use strict';

angular.module('BeehivePortal')
  .controller('TriggerListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$$Tag', '$q', '$timeout', '$uibModal', '$$Location', '$$Trigger', 
    function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type,$$Tag, $q, $timeout, $uibModal, $$Location, $$Trigger) {
    
    /**
     * init args
     */
    
    $scope.triggers = [];
    $scope.typeList = [
        {name: 'conditional', displayName: 'triggerManager.conditionRule', disabled: false, icon:'fa-code-fork'},
        {name: 'schedule', displayName: 'triggerManager.scheduleRule', disabled: false, icon:'fa-clock-o'}
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
        var confirm = function(){
            if(trigger.triggerID){
                $$Trigger.remove({triggerID: trigger.triggerID}, function(){
                    $scope.triggers.remove(trigger);
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
        var options = {
            msg: 'triggerManager.deleteTriggerMsg',
            callback: function(){
                $scope.deleteTrigger(trigger);
            }
        };

        AppUtils.confirm(options); 
    });

    $scope.$on('enableTrigger', function(e, trigger){
        var options = {
            msg: 'triggerManager.enableTriggerMsg',
            callback: function(){
                $scope.enableTrigger(trigger);
            }
        };

        AppUtils.confirm(options); 
    });

    $scope.$on('disableTrigger', function(e, trigger){
        var options = {
            msg: 'triggerManager.disableTriggerMsg',
            callback: function(){
                $scope.disableTrigger(trigger);
            }
        };

        AppUtils.confirm(options); 
    });

    $scope.triggerFilter = function(trigger){
        if(!$scope.showDisabled && trigger.disabled){
            return false;
        }
        return _.find($scope.typeList, {name: trigger.type, disabled: false});
    };
    
  }]);
