'use strict';

angular.module('BeehivePortal')
  .controller('ThingManagerController', ['$scope', '$rootScope', '$state', 'AppUtils', '$uibModal',function($scope, $rootScope, $state, AppUtils, $uibModal) {
    
    /*
     * context menu setting
     */
    
    $scope.myMenu = {
        itemList:[
            {
                text:'Edit',
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
            },{
                text:'Delete',
                callback: function (thing) {
                    console.log('Delete thing');
                    console.log(thing);
                }
            }
        ],
        setting:{

        }
    };

  }]);


angular.module('BeehivePortal')
  .controller('ThingManagerController.EditThing',function ($scope, $uibModalInstance, thing) {
    $scope.thing = thing;
    $scope.ok = function () {
        $uibModalInstance.close($scope.thing);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  });