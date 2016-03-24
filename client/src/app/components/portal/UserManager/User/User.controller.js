'use strict';

angular.module('BeehivePortal')
  .controller('UserController', ['$scope', '$rootScope', '$state', 'AppUtils',function($scope, $rootScope, $state, AppUtils) {
    // TODO
  }]);



angular.module('BeehivePortal')
  .controller('UserController.EditUser',function ($scope, $uibModalInstance, user, $$User, PortalService) {
    
    $scope.user = user;

    $scope.ok = function () {
        $$User.update(user, function(user){
            $uibModalInstance.close($scope.user);
            console.log('save user succeeded!')
        }, function(){
            console.log('failed to save user!');
        });
        
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  });