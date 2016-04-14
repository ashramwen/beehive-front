'use strict';

angular.module('BeehivePortal')
  .controller('AppController', ['$scope', '$rootScope', '$state', 'AppUtils', 'Session', function($scope, $rootScope, $state, AppUtils, Session) {
    Session.useCredential();

    $scope.thirdPartyAPIUrl = window.thirdPartyAPIUrl;
  }]);
