'use strict';

angular.module('BeehivePortal')
  .controller('ThingDetailController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing',function($scope, $rootScope, $state, AppUtils, $$Thing) {
    $scope.thing = {};

    $scope.init = function(){
        $scope.thing = $$Thing.get({globalThingID: $state.params.thingid});
    };

    $scope.goThingACL = function(){
        $state.go($scope.navMapping.LOCATHON_THING_ACL, $state.params);
    };

  }]);


