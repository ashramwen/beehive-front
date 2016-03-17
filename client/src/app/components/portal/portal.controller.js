'use strict';

angular.module('BeehivePortal')
  .controller('PortalController', ['$scope', '$rootScope', '$state', 'AppUtils', 'Session', 'PermissionControl', 'PortalService', function($scope, $rootScope, $state, AppUtils, Session, PermissionControl, PortalService) {
    
    /*
     * objects for generating navigations content on left nav column.
     * by George
     */
    $scope.PermissionControl = PermissionControl;
    $rootScope.PermissionControl = PermissionControl;
    
    $scope.portalNavs = PortalService.getPortalNavs();

    $scope.getStateChan = PortalService.getStateChan;
    $scope.isActive = PortalService.isActive;
    $scope.navMapping = PortalService.navMapping;

    $scope.navigateTo = function(stateName, params){
        $state.go(stateName, _.extend($state.params, params));
    };

    /*
     * initialize 
     */
    $scope.portalInit = function(){
        
    };

    $scope.getFirstChild = function(nav){
        return _.find(nav.subViews, function(subView){
            return !subView.hidden;
        });
    }

    $scope.toggleMenu = function(){
        $('.left-side').toggleClass('sidebar-offcanvas');
        $('.right-side').toggleClass('shrink');
    };

    $scope.logout = function(){
        Session.destroy();
        PermissionControl.destroy();
        $state.go('app.secure.UserLogin');
    }
  }]);