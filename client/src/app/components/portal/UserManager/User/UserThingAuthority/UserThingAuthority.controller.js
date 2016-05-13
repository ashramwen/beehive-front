'use strict';

angular.module('BeehivePortal')
  .controller('UserThingAuthorityController', ['$scope', '$rootScope', '$state', 'AppUtils', '$timeout', '$$Thing', '$$Tag', '$q', '$$Location', '$$User', function($scope, $rootScope, $state, AppUtils, $timeout, $$Thing, $$Tag, $q, $$Location, $$User) {
    
    $scope.ownThings = [];
    $scope.selectedThings = [];
    var userID = $state.params['userID'];

    $scope.init = function(){
        $scope.ownThings = $$User.getThings({userID: userID});
    };

    $scope.addThings = function(things){
        var things = _.difference(things, $scope.ownThings);
        $$User.bindThing({thingIDs: _.pluck(things, 'globalThingID'), userIDs: [userID]}, function(){
            $scope.ownThings = $scope.ownThings.concat(things);
        });
    };

    $scope.removeThing = function(thing){
        $$User.unbindThing({thingIDs: [thing.globalThingID], userIDs: [userID]}, function(){
            $scope.ownThings.remove(thing);
        });
    };
    


  }]);
