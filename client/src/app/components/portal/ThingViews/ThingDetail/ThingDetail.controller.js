'use strict';

angular.module('BeehivePortal')
  .controller('ThingDetailController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$uibModal', '$timeout', function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type, $uibModal, $timeout) {
    $scope.thing = {};
    $scope.dataset = {
        triggers:[]
    };
    var customEditor,
        statusEditor;



    $scope.init = function(){
        $scope.thing = $$Thing.get({globalThingID: $state.params.thingid}, function(thing){
            /**
             * test
             */
            var myTrigger = new Trigger(Trigger.TypeEnum.SIMPLE);
            $scope.dataset.triggers.push(myTrigger);
            myTrigger.setSource(thing.globalThingID);
            myTrigger.name = "A simple trigger";

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
    $scope.openEditRuleModal = function(trigger){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/ThingViews/ThingRule.template.html',
            controller: 'ThingDetailController.EditRule',
            size: 'lg',
            resolve: {
              trigger: function () {
                return trigger;
              }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log(thing);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

  }])
  .controller('ThingDetailController.EditRule',['$scope', '$uibModalInstance', 'trigger', function ($scope, $uibModalInstance, trigger) {

  }]);


