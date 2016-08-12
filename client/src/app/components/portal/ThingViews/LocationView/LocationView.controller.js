'use strict';

angular.module('BeehivePortal')
  .controller('LocationViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Tag', '$$Thing', '$$Location', 'PortalService',function($scope, $rootScope, $state, AppUtils, $$Tag, $$Thing, $$Location, PortalService) {
    $scope.things = [];
    $scope.thingsForDisplay = [];

    /*
     * Init app
     */
    $scope.init = function(){

        /*
         * context menu item setting
         */
        var showDetailItem =_.find($scope.myMenu.itemList,function(item){
          return item.text == '查看详情';
        });
        _.extend(showDetailItem, {callback:function(thing){
            $scope.navigateTo($scope.navMapping.LOCATION_THING_DETAIL, {thingid: thing.id});
        }});
    };

    $scope.viewThing = function(thing){
      $scope.navigateTo($scope.navMapping.LOCATION_THING_DETAIL, {thingid: thing.id});
    };

    $scope.locationChange = function(location){
      $$Location.getThingsByLocation({location: location}, function(things){
        $scope.things = things;
      });
    };

    
  }]);
