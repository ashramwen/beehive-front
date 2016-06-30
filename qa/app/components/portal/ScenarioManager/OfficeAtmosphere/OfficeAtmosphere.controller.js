'use strict';

angular.module('BeehivePortal.ScenarioManager.OfficeAtmosphere')
  .controller('OfficeAtmosphereController', ['$scope', '$rootScope', '$state', 'AppUtils', '$timeout', '$interval', 'TriggerPanelService', '$$Location', function($scope, $rootScope, $state, AppUtils, $timeout, $interval, TriggerPanelService, $$Location) {


    $scope.init = function(){
      $$Location.queryAll(function(locations){
          var $panelControl = $('.app-portal-scenariomanager-officeatmosphere');
          $scope.panelControl = TriggerPanelService.factory($panelControl, $scope);

          $scope.panelControl.dataContainer.locationTree = new LocationTree(_.pluck(locations, 'displayName')).tree;
          $scope.panelControl.selectLocation($scope.panelControl.dataContainer.locationTree);

          $scope.$on('toggle-menu', function(data){
            var timer = $interval(function(){
                $scope.panelControl.redraw.call($scope.panelControl);
              }, 50);

            $timeout(function(){
              $interval.cancel(timer);
            }, 1000);
          });

          $scope.toggleMenu();
      });
    };

    if($rootScope.login){
      $scope.init();
    }

    $scope.$on('tokenReady', function(flag){
      if(!flag)return;
      $scope.init();
    });

    $scope.$on('$destroy', function(){
      if($scope.panelControl)
        $scope.panelControl.destroy();
    });

  }]);
