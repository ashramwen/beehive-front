'use strict';

angular.module('BeehivePortal')
  .controller('LocationViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Tag', '$$Thing', '$$Location', 'PortalService',function($scope, $rootScope, $state, AppUtils, $$Tag, $$Thing, $$Location, PortalService) {
    $scope.things = [];
    $scope.thingsForDisplay = [];
    /*
     * dropdown options for loacation.
     */
    $scope.selectedLocation = {};

    /*
     * Init app
     */
    $scope.init = function(){
        $scope.things = $$Thing.getAll();
        $scope.locationsTree = [];

        /*
         * tree settings
         */
        $scope.treeOptions = {
            multiSelection: false,
            nodeChildren: "children",
            dirSelectable: true,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
        };

        if(!$scope.PermissionControl.allowAction('SEARCH_LOCATIONS'))return false;

        $scope.locations = $$Location.queryAll(function(locations){
            $scope.locationTree = new LocationTree(_.pluck(locations, 'displayName'));
        });
        
        /*
         * context menu item setting
         */
        var showDetailItem =_.find($scope.myMenu.itemList,function(item){
          return item.text == '查看详情';
        });
        _.extend(showDetailItem,{callback:function(thing){
            $scope.navigateTo($scope.navMapping.LOCATION_THING_DETAIL, {thingid: thing.globalThingID});
        }});
    };

    $scope.selectLocation = function(location){
        $scope.things = $$Thing.byTag({tagType: 'Location', displayName: location.id});
    };

    $scope.search = function(locationTag){
        $scope.things = $$Thing.byTag({tagType: 'Location', displayName: locationTag.displayName});
    };
    
  }]);
