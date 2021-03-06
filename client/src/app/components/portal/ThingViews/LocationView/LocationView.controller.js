'use strict';

angular.module('BeehivePortal')
  .controller('LocationViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Tag', '$$Thing', '$$Location', 'PortalService', '$timeout',function($scope, $rootScope, $state, AppUtils, $$Tag, $$Thing, $$Location, PortalService, $timeout) {
    $scope.things = [];
    $scope.thingsForDisplay = [];

    $scope.$watch('login', function(val){
      if(!val) return;
      $scope.init();
    });

    /*
     * Init app
     */
    $scope.init = function(){
        $scope.type = $scope.$state.type;
        $scope.location = $scope.$state.location;
        /*
         * context menu item setting
         */
        var showDetailItem =_.find($scope.myMenu.itemList,function(item){
          return item.text == 'controls.view';
        });
        _.extend(showDetailItem, {callback:function(thing){
            $scope.navigateTo($scope.navMapping.LOCATION_THING_DETAIL, {thingid: thing.id});
        }});
        $timeout(function(){
          $scope.inputFilterOptions({type: $scope.$state.params.type, location: $scope.$state.params.location});
        });

        $scope.$on('type-loaded', function(){
          $scope.typeLoaded = true;

          if($scope.typeLoaded && $scope.locationLoaded && $scope.search){
            $scope.search();
          }
        });

        $scope.$on('location-loaded', function(){
          $scope.locationLoaded = true;

          if($scope.typeLoaded && $scope.locationLoaded && $scope.search){
            $scope.search();
          }
        });

    };

    $scope.viewThing = function(thing){
      $scope.navigateTo($scope.navMapping.LOCATION_THING_DETAIL, _.extend({thingid: thing.id}, $scope.$state.params, {location: $scope.selectedLocation, type: $scope.type}));
    };

    $scope.thingListChange = function(things, type, location){
      if(location){
        $scope.selectedLocation = location.locationID;
        if(type){
          $scope.type = type.value;
        }
      }
      $scope.things = _.map(things, function(thing){
        return {
          id: thing.globalThingID,
          type: thing.typeDisplayName,
          vendorThingID: thing.vendorThingID,
          locationDisplayName: thing.locationDisplayName
        };
      });
    };

    
  }]);
