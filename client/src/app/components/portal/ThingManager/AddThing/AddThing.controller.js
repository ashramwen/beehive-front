'use strict';

angular.module('BeehivePortal')
  .controller('AddThingController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type) {
    $scope.types = [];

    $scope.init = function(){
        $scope.types = $$Type.getAll();
        $scope.thing = new BeehiveThing();
    };

    $scope.saveThing = function(thing){
        $$Thing.save(thing);
    };




  }]);