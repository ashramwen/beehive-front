'use strict';

angular.module('BeehivePortal')
  .controller('GatewayController', ['$scope', '$rootScope', '$uibModal', 'AppUtils', '$$Thing', '$$Type', '$$Location', '$timeout', 'GatewayService', function($scope, $rootScope, $uibModal, AppUtils, $$Thing, $$Type, $$Location, $timeout, GatewayService) {
    
    $scope.things = [];
    $scope.highlighted = null;
    $scope.order = 'typeDisplayName';

    $rootScope.$watch('login', function(newVal){
        if(!newVal) return;
        $scope.init();
    });

    /*
     * Init app
     */
    $scope.init = function(){
        $timeout(function(){
            $scope.inputFilterOptions({type: 'gateway', location: $scope.$state.params.location});
            var gateway = $scope.$state.params['gateway'];
            if(gateway){
                $scope.showGatewayThings({globalThingID: gateway});
                $scope.$on('location-loaded', function(){
                    $scope.search();
                });
            }
        });
    };

    $scope.getGateways = function(gateways, type, location){
        if(!gateways || type.value != 'gateway')return;
        if(location){
            $scope.location = location.locationID;
        }
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
            AppUtils.alert({msg: "thingManager.gatewayAddedMsg"});
            $scope.gateways.push(gateway);
        });
    };

    $scope.showGatewayThings = function(gateway){
        var dirtyFields = ['target', 'taiwanNo1', 'novalue'];
        $scope.gateway = gateway;
        $scope.highlighted = gateway;


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

    $scope.viewThing = function(thing){
        $scope.$state.go('app.portal.ThingManager.ThingDetail', {
            thingid: thing.globalThingID, 
            gateway: $scope.gateway.globalThingID, 
            location: $scope.location
        });
    };

  }])
  .controller('GatewayController.CreateGateway', ['$scope', '$uibModalInstance', '$$Thing', function($scope, $uibModalInstance, $$Thing){
    $scope.gateway = {
        vendorThingID: '',
        location: ''
    };

    $scope.createGateway = function(){
        if(!$scope.addGateway.$valid || $scope.gateway.vendorThingID.length!=3 ){
            return;
        }
        var gatewayObj = {
            vendorThingID: ($scope.gateway.location + '-Z-' + $scope.gateway.vendorThingID).toUpperCase(),
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