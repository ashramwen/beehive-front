'use strict';

angular.module('BeehivePortal')
  .controller('ThingDetailController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$uibModal', function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type, $uibModal) {
    $scope.thing = {};
    $scope.dataset = {
        triggers:[]
    };



    $scope.init = function(){
        $scope.thing = $$Thing.get({globalThingID: $state.params.thingid}, function(thing){
            /**
             * test
             */
            var myTrigger = new Trigger(Trigger.TypeEnum.SIMPLE);
            $scope.dataset.triggers.push(myTrigger);
            myTrigger.setSource(thing.globalThingID);
            myTrigger.name = "A simple trigger";
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


