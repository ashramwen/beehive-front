'use strict';

angular.module('BeehivePortal')
  .controller('UserController', ['$scope', '$rootScope', '$state', 'AppUtils',function($scope, $rootScope, $state, AppUtils) {
    // TODO
  }]);



angular.module('BeehivePortal')
  .controller('UserController.EditUser',['$scope', '$uibModalInstance', 'user', '$$UserManager', '$$Thing', '$$Tag', '$rootScope', '$$User', 'TriggerDetailService', '$timeout', function ($scope, $uibModalInstance, user, $$UserManager, $$Thing, $$Tag, $rootScope, $$User, TriggerDetailService, $timeout) {
    
    $scope.user = angular.copy(user);

    $scope.inputMethods = {inputThingDataset: null};
    $scope.selectedThings = [];

    $scope.init = function(){
        $rootScope.$watch('login', function(newVal){
            if(!newVal) return;
            $$User.getThings({userID: $scope.user.userID}, function(things){
                $scope.selectedThings = _.pluck(things, 'globalThingID');
                TriggerDetailService.getThingsDetail(things, true).then(function(things){
                    $scope.inputMethods.inputThingDataset({selectedThings: things});
                });
            });
        });
    };

    $scope.selectedChange = function(selectedThings, type){
        $scope.things = _.pluck(selectedThings, 'globalThingID');
    };


    $scope.ok = function () {
        $$UserManager.update($scope.user, function(user){
            var thingsToDelete = _.difference($scope.selectedThings, $scope.things);
            var thingsToAdd = _.difference($scope.things, $scope.selectedThings);

            if(thingsToAdd.length){
                $scope.addThings(thingsToAdd, user);
            }
            if(thingsToDelete.length){
                $scope.removeThing(thingsToDelete, user);
            }
            $uibModalInstance.close($scope.user);
        }, function(response){
            if(response.data.errorCode == "DuplicateKeyException"){
                AppUtils.alert({msg: 'userManager.userNameConflictMsg'});
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.addThings = function(globalThingIDs, user){
        $$User.bindThing({}, {globalThingIDs: [globalThingIDs], userIDs: [user.userID]});
    };

    $scope.removeThing = function(globalThingIDs, user){
        $$User.unbindThing({globalThingIDs: globalThingIDs, userIDs: [user.userID]});
    };
  }]);