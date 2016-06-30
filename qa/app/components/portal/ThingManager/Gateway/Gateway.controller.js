'use strict';

angular.module('BeehivePortal')
  .controller('GatewayController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$$Location', '$uibModal', 'WebSocketClient', function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type, $$Location, $uibModal, WebSocketClient) {
    $scope.things = [];

    /*
     * Init app
     */
    $scope.init = function(){

        $rootScope.$watch('login', function(newVal){
            if(!newVal) return;
            $scope.locationsTree = [];

            /*
             * tree settings
             */
            $scope.treeOptions = {
                multiSelection: false,
                nodeChildren: "children",
                dirSelectable: true,
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "a8"
                }
            };


            $$Location.queryAll(function(locations){
                $scope.locationTree = new LocationTree(_.pluck(locations, 'displayName')).tree.children;
                $scope.selectLocation($scope.locationTree[0]);
            });
        });

        var wsClient = WebSocketClient.getClient();
    };

    $rootScope.$watch('login', function(flag){
        if(flag){
            $scope.init();
        }
    });

    $scope.selectLocation = function(location){
        $$Thing.byTag({tagType: 'Location', displayName: location.id}, function(things){
            $scope.things = _.filter(things, function(thing){
                return thing.type == 'gateway-streetlight';
            });
        });
    };

    $scope.showGatewayThings = function(gateway){
        $$Thing.getEndNodes({}, gateway, function(endNodes){

            $scope.endNodes = endNodes;

            _.each(endNodes, function(endNode, index){
                $scope.endNodes[index].kiiThingID = gateway.kiiThingID;
                $scope.endNodes[index].kiiAppID = gateway.kiiAppID;
            });
        });
    };

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

    $scope.removeEndNode = function(endNode){
        AppUtils.confirm('删除节点','您确认要删除这个节点吗？', function(){
            $$Thing.removeEndNode({}, endNode, function(){
                $scope.endNodes.remove(endNode);
            });
        });
    };
  }])
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