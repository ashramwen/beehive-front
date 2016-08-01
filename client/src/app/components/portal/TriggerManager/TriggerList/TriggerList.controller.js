'use strict';

angular.module('BeehivePortal')
  .controller('TriggerListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$$Tag', '$q', '$timeout', '$uibModal', '$$Location', '$$Trigger', 
    function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type,$$Tag, $q, $timeout, $uibModal, $$Location, $$Trigger) {
    
    /**
     * init args
     */
    
    $scope.triggers = [];

    $scope.init = function(){

        $$Trigger.getAll(function(triggers){
            console.log(triggers);
            _.each(triggers, function(trigger){
                var t = new Trigger(trigger.type);
                t.init(trigger);
                $scope.triggers.push(t);
            });
        });
    };

    $scope.createTrigger = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/TriggerManager/CreateTrigger.template.html',
            controller: 'TriggerManagerController.CreateTrigger',
            size: 'md',
            resolve: {
            }
        });

        modalInstance.result.then(function (trigger) {
            $scope.triggers.splice(0, 0, trigger);
        });
    };

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

    $scope.dataset = {};
    
  }])
  .controller('TriggerManagerController.CreateTrigger', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance){
    $scope.triggerTypes = [
        {
            text: '定时任务',
            value: Trigger.TypeEnum.SIMPLE
        },
        {
            text: '多触发源',
            value: Trigger.TypeEnum.GROUP
        },
        {
            text: '汇总',
            value: Trigger.TypeEnum.SUMMARY
        }
    ];

    $scope.triggerBO = {};

    
    $scope.ok = function(triggerBO){

        var trigger = new Trigger(triggerBO.triggerType);
        trigger.setName(triggerBO.triggerName);
      
        $uibModalInstance.close(trigger);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
