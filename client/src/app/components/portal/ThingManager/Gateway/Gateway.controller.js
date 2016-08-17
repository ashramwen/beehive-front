'use strict';

angular.module('BeehivePortal')
  .controller('GatewayController', ['$scope', '$rootScope', '$uibModal', 'AppUtils', '$$Thing', '$$Type', '$$Location', '$timeout', 'GatewayService', function($scope, $rootScope, $uibModal, AppUtils, $$Thing, $$Type, $$Location, $timeout, GatewayService) {
    
    $scope.things = [];

    $rootScope.$watch('login', function(newVal){
        if(!newVal) return;
        $scope.init();
    });

    /*
     * Init app
     */
    $scope.init = function(){
        $timeout(function(){
            $scope.inputFilterOptions({type: 'gateway'});
        });
    };

    $scope.getGateways = function(gateways){
        if(!gateways)return;
        $$Thing.getThingsByIDs(_.pluck(gateways, 'globalThingID'), function(things){
            $scope.gateways = _.map(things, function(thing){
                thing.globalThingID = thing.id;

                $$Thing.getOnboardingInfo({vendorThingID: thing.vendorThingID}, function(onborderInfo){
                    _.extend(thing, onborderInfo);
                });
                return thing;
            });
            
        });
    };

    $rootScope.$watch('login', function(flag){
        if(flag){
            $scope.init();
        }
    });

    $scope.addGateway = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app-portal-thingmanager-addgateway',
            controller: 'GatewayController.CreateGateway',
            size: 'sm'
        });

        modalInstance.result.then(function (gateway) {
            AppUtils.alert('网关添加成功！', '提示信息');
            $scope.gateways.push(gateway);
        });
    };

    $scope.showGatewayThings = function(gateway){
        var dirtyFields = ['target', 'taiwanNo1', 'novalue'];

        $$Thing.getEndNodes({}, gateway, function(endNodes){

            $scope.endNodes = endNodes;
            _.each($scope.endNodes, function(endNode){
                if(endNode.status){
                    _.each(dirtyFields, function(field){
                        delete endNode.status[field];
                    });
                }
            })

            GatewayService.getThingsDetail($scope.endNodes);

            _.each(endNodes, function(endNode, index){
                endNode.kiiAppID = gateway.kiiAppID;
            });
        });
    };

    /*
    $scope.showReplaceModal = function(endNode){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/ThingManager/Gateway/Replacement.template.html',
            controller: 'GatewayController.Replacement',
            size: 'md',
            resolve: {
              endNode: function () {
                return endNode;
              }
            }
        });

        modalInstance.result.then(function (endNode) {
            _.extend(endNode, endNode);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    */

    $scope.removeEndNode = function(endNode){
        AppUtils.confirm('删除节点','您确认要删除这个节点吗？', function(){
            $$Thing.removeEndNode({}, endNode, function(){
                $scope.endNodes.remove(endNode);
            });
        });
    };
  }])
  .controller('GatewayController.CreateGateway', ['$scope', '$uibModalInstance', '$$Thing', function($scope, $uibModalInstance, $$Thing){
    $scope.gateway = {
        vendorThingID: '',
        location: ''
    };

    $scope.createGateway = function(){
        var gatewayObj = {
            vendorThingID: ($scope.gateway.location + '-00-' + $scope.gateway.vendorThingID).toUpperCase(),
            type: 'gateway',
            kiiAppID: AppConfig.kiiAppID
        };

        $$Thing.save(gatewayObj, function(gateway){
            $uibModalInstance.close(gateway);
            console.log(gateway);
        });
    };

    $scope.locationChange = function(location){
        $scope.gateway.location = location;
    };
  }]);
  /*
  .controller('GatewayController.Replacement', ['$scope', '$uibModalInstance', '$$Thing', 'endNode', '$http', function($scope, $uibModalInstance, $$Thing, endNode, $http){

    $scope.endNode = {
        kiiAppID: endNode.kiiAppID,
        kiiThingID: endNode.kiiThingID,
        endNodeVendorThingID: endNode.vendorThingID,
        thingID: endNode.thingID
    };

    $scope.ok = function () {
        $$Thing.replaceEndNode({}, $scope.endNode, function(){
            endNode.vendorThingID = $scope.endNode.endNodeVendorThingID;
            $uibModalInstance.close(endNode);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  }]);
  */