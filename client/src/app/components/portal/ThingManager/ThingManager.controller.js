'use strict';

angular.module('BeehivePortal')
  .controller('ThingManagerController', ['$scope', '$rootScope', '$state', 'AppUtils', '$uibModal',function($scope, $rootScope, $state, AppUtils, $uibModal) {
    
    
    /*
     * create remote control modal
     */
    $scope.openRemoteControl = function(thing){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/ThingManager/RemoteControl.template.html',
            controller: 'ThingManagerController.RemoteControl',
            size: 'md',
            resolve: {
              thing: function () {
                return thing;
              }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log(thing);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
    
    /*
     * context menu setting
     */
    $scope.myMenu = {
        itemList:[
            {
                text: '查看详情',
                callback: function(thing){
                    $scope.navigateTo($scope.otherNavs.THING_DETAIL, {id: thing.name});
                }
            },
            {
                text:'编辑',
                callback: function (thing) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/components/portal/ThingManager/EditThing.template.html',
                        controller: 'ThingManagerController.EditThing',
                        size: 'md',
                        resolve: {
                          thing: function () {
                            return thing;
                          }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        console.log(thing);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                }
            },
            {
                text:'删除',
                callback: function (thing) {
                    console.log('Delete thing');
                    console.log(thing);
                }
            }
        ],
        setting:{

        }
    };

  }])

  /*
   * remote control modal controller
   */
  .controller('ThingManagerController.RemoteControl',function ($scope, $uibModalInstance, thing, $timeout) {
    $scope.thing = thing;
    $scope.status = {};
    $scope.ok = function () {
        $uibModalInstance.close($scope.thing);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $uibModalInstance.opened.then(function(){
        $timeout(function(){
            $scope.slider1 = {
                value: 150,
                options: {
                    floor: 0,
                    ceil: 450
                }
            };
            $scope.slider2 = {
                value: 20,
                options: {
                    floor: 16,
                    ceil: 30
                }
            };

        });
    });
    
  })

  /*
   * edit thing modal controller
   */
  .controller('ThingManagerController.EditThing',function ($scope, $uibModalInstance, thing) {
    $scope.thing = thing;
    $scope.ok = function () {
        $uibModalInstance.close($scope.thing);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  });