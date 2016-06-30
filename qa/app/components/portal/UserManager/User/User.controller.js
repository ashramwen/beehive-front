'use strict';

angular.module('BeehivePortal')
  .controller('UserController', ['$scope', '$rootScope', '$state', 'AppUtils',function($scope, $rootScope, $state, AppUtils) {
    // TODO
  }]);



angular.module('BeehivePortal')
  .controller('UserController.EditUser',['$scope', '$uibModalInstance', 'user', '$$UserManager', 'PortalService', '$$Thing', '$$Tag', '$rootScope', '$$User', function ($scope, $uibModalInstance, user, $$UserManager, PortalService, $$Thing, $$Tag, $rootScope, $$User) {
    
    $scope.user = user;

    $scope.init = function(){
        $rootScope.$watch('login', function(newVal){
            if(!newVal) return;
            $scope.things = $$User.getThings({userID: $scope.user.userID});
            $scope.tags = $$User.getTags({userID: $scope.user.userID});
            $scope.allTags = $$Tag.queryAll();
        });
    };


    $scope.ok = function () {
        $$UserManager.update(user, function(user){
            $uibModalInstance.close($scope.user);
            console.log('save user succeeded!')
        }, function(){
            console.log('failed to save user!');
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


    $scope.addTag = function(tag, user){
        $$User.bindTag({tags: [tag.fullTagName], userIDs:[user.userID]}, function(){
            $scope.tags = $scope.tags || [];
            $scope.tags.push(tag);
        });
    }

    $scope.removeTag = function(tag, user){
        $$User.unbindTag({tags: [tag.fullTagName], userIDs:[user.userID]}, function(){
            $scope.tags.remove(tag);
        });
    };

    $scope.addThings = function(globalThingIDs, user){
        $$User.bindThing({}, {globalThingIDs: [globalThingIDs], userIDs: [user.userID]}, function(things){
            $scope.things = $scope.things || [];
            _.each(globalThingIDs, function(globalThingID){
                $scope.things.push($$Thing.get({globalThingID: globalThingID}));
            });
        });
    };

    $scope.removeThing = function(thing, user){
        $$User.unbindThing({globalThingIDs: [thing.globalThingID], userIDs: [user.userID]}, function(){
            $scope.things.remove(thing);
        });
    };
  }]);