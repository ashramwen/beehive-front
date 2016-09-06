'use strict';

angular.module('BeehivePortal')
  .controller('PortalController', ['$scope', '$rootScope', '$state', 'AppUtils', 'Session', 'PortalService', 'ownership', function($scope, $rootScope, $state, AppUtils, Session, PortalService, ownership) {

    /*
     * objects for generating navigations content on left nav column.
     * by George
     */

    $scope.navigateTo = function(stateName, params){
        $state.go(stateName, _.extend($state.params, params));
    };

    /*
     * initialize
     */
    $scope.portalInit = function(){
      $rootScope.$watch('login', function(newVal){
        if(!newVal) return;
        $scope.portalNavs = PortalService.getPortalNavs();
      });

      $scope.getStateChan = PortalService.getStateChan;
      $scope.isActive = PortalService.isActive;
      $scope.navMapping = PortalService.navMapping;
    };

    $scope.getFirstChild = function(nav){
        return _.find(nav.subViews, function(subView){
            return !subView.hidden;
        });
    };

    $scope.toggleMenu = function(){
        $('.left-side').toggleClass('sidebar-offcanvas');
        $('.right-side').toggleClass('shrink');
        var flag = $('.right-side').hasClass('shrink');
        $scope.$broadcast('toggle-menu', {isShrink: flag});
    };

    $scope.goBack = function(){
      $rootScope.$state.go($rootScope.$state.current.previous, $rootScope.$state.params);
    }

    $scope.logout = function(){
        Session.destroy();
        $state.go('app.secure.UserLogin');
    };

    $scope.isCreator = ownership.isCreator;
  }]);
