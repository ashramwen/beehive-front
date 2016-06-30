'use strict';

angular.module('BeehivePortal')
  .controller('ThingACLController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', function($scope, $rootScope, $state, AppUtils, $$User) {
    
    $scope.users = $$User.query({role: '4'}, function(users){
        console.log(users);
    });

    $scope.acls = [{name: '开关'},{name: '亮度'}];

  }]);