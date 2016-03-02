'use strict';

angular.module('BeehivePortal')
  .controller('TriggerManagerController', function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type,$$Tag, $q, $timeout, $uibModal, $$Location) {
    
    /**
     * init args
     */
    
    var trigger = new Trigger(Trigger.TypeEnum.SUMMARY);

    _.extend(trigger, {
        name: '触发器1',
        things: [],
        rules: '',
        targets: []
    });
    

    $scope.triggers = [
        trigger
    ];

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

    $scope.dataset = {};
    
  })
  .controller('TriggerManagerController.CreateTrigger', ['$scope', '$uibModalInstance', function($scope, $uibModalInstance){
    $scope.triggerTypes = [
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
