'use strict';

angular.module('BeehivePortal')
  .controller('ThingDetailController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$uibModal', '$timeout', '$$Trigger', '$log', function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type, $uibModal, $timeout, $$Trigger, $log) {
    $scope.thing = {};
    $scope.dataset = {
        triggers:[]
    };
    var customEditor,
        statusEditor;

    $scope.init = function(){
        $scope.thing = $$Thing.get({globalThingID: $state.params.thingid}, function(thing){

            $$Thing.getOnboardingInfo({globalThingID: thing.vendorThingID}, function(onboardingInfo){
                _.extend($scope.thing, onboardingInfo);
                $log.debug(onboardingInfo);
            });

            /**
             * get triggers
             */
            $$Thing.getTriggers({globalThingID: $state.params.thingid}, function(triggers){
                _.each(triggers, function(trigger){
                    var t = new Trigger(trigger.type);
                    t.init(trigger);
                    $scope.dataset.triggers.push(t);
                });
            });

            /**
             * init json editors
             */
            $timeout(function(){
                var options = {mode: 'code'};

                statusEditor = document.getElementById("statusEditor");
                statusEditor = new JSONEditor(statusEditor, options);

                customEditor = document.getElementById("customEditor");
                customEditor = new JSONEditor(customEditor, options);
            },50);
        });
    };

    $scope.editStatus = function(status){
        $scope.statusOnEdit = true;
        statusEditor.set(status);
    };

    $scope.editCustom = function(custom){
        $scope.customOnEdit = true;
        customEditor.set(custom);
    };

    $scope.submitStatus = function(thing){
        thing.status = statusEditor.get();

        $$Thing.save({}, thing, function(){
            AppUtils.alert('更新设备信息成功！', '提示信息');
            $scope.statusOnEdit = false;
        });
    };

    $scope.submitCustomFields = function(thing){
        thing.custom = customEditor.get();

        $$Thing.save({}, thing, function(){
            AppUtils.alert('更新设备信息成功！', '提示信息');
            $scope.customOnEdit = false;
        });
    };

    $scope.goThingACL = function(){
        $state.go($scope.navMapping.LOCATHON_THING_ACL, $state.params);
    };

    /*
     * create edit rule control modal
     */
    $scope.createTriggerModal = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/ThingViews/ThingRule.template.html',
            controller: 'ThingDetailController.CreateTrigger',
            size: 'lg',
            resolve: {
                thing: function(){
                    return $scope.thing;
                }
            }
        });

        modalInstance.result.then(function (trigger) {
            $scope.dataset.triggers.push(trigger);
        });
    };

    /**
     * delete trigger
     * @return {[type]} [description]
     */
    $scope.deleteTrigger = function(trigger){
        if(trigger.triggerID){
            $$Trigger.remove({}, trigger, function(){
                $scope.dataset.triggers.remove(trigger);
            });
        }else{
            $scope.dataset.triggers.remove(trigger);
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

  }])
  .controller('ThingDetailController.CreateTrigger',['$scope', '$uibModalInstance', 'thing', function ($scope, $uibModalInstance, thing) {
    $scope.triggerBO = {};

    $scope.ok = function(){
        var trigger = new Trigger(Trigger.TypeEnum.SIMPLE);
        trigger.setName($scope.triggerBO.triggerName);
        trigger.setSource(thing.globalThingID);
        $uibModalInstance.close(trigger);
    };

    $scope.cancel = function(){
        $uibModalInstance.dismiss();
    };
  }]);


