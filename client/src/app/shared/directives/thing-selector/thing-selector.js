angular.module('BeehivePortal')
  .directive('thingSelector', ['$compile', '$timeout', function($compile, $timeout) {
      return{
        restrict: 'E',
        replace: true,
        scope:{
            selectedThings: '=?',
            selectedType: '=?'
        },
        templateUrl: 'app/shared/directives/thing-selector/thing-selector.template.html',
        controller:['$scope', '$$Tag', '$$Thing', '$$Location', '$$Type', '$timeout', '$q', 'PermissionControl', function($scope, $$Tag, $$Thing, $$Location, $$Type, $timeout, $q, PermissionControl){
            
            $scope.dataset = {
                tags: [],
                types: [],
                locations: []
            };

            $scope.things = [];
            $scope.unselectedThings = [];

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

            $scope.init = function(){

                $scope.tagAllowed = PermissionControl.isAllowed('SEARCH_TAGS') && PermissionControl.isAllowed('SEARCH_THINGS');
                $scope.locationAllowed = PermissionControl.isAllowed('SEARCH_LOCATIONS') && PermissionControl.isAllowed('SEARCH_THINGS');
                $scope.typeAllowed = PermissionControl.isAllowed('SEARCH_TYPES') && PermissionControl.isAllowed('SEARCH_THINGS');

                $scope.allDisabled = !$scope.tagAllowed && !$scope.locationAllowed && !$scope.typeAllowed;

                if($scope.tagAllowed){
                    $scope.dataset.tags = $$Tag.queryAll();
                }

                if($scope.locationAllowed){
                    $$Location.queryAll(function(locations){
                        $scope.dataset.locations = (new LocationTree(_.pluck(locations, 'displayName'))).tree.children;
                    });
                }

                if($scope.typeAllowed){
                    $scope.dataset.types = $$Type.getAll();
                }
            };

            $scope.selectLocation = function(location){
                $scope.things = $$Thing.byTag({tagType: 'Location', displayName: location.id}, function(){
                    $timeout(function(){
                        $scope.whenThingChange();
                    });
                });
            };

            $scope.selectType = function(type){
                $scope.things = $$Thing.byType({}, {typeName: type.type}, function(){
                    $timeout(function(){
                        $scope.whenThingChange();
                    });
                });
            };

            $scope.selectTag = function(tag){
                $scope.things = $$Thing.byTag({tagType: 'Custom', displayName: tag.displayName}, function(){
                    $timeout(function(){
                        $scope.whenThingChange();
                    });
                });
                
            };

            $scope.whenThingChange = function(){
                $scope.unselectedThings = _.filter($scope.things, $scope.unselectedFilter);
            }

            $scope.unselectedFilter = function(thing){
                return !_.find($scope.selectedThings, function(selectedThing){
                    return selectedThing.vendorThingID == thing.vendorThingID;
                });
            };

            $scope.selectUnselectedThing = function(thing){
                $scope.selectedUnselectedThing = thing;
            };

            $scope.selectSelectedThing = function(thing){
                $scope.selectedSelectedThing = thing;
            };

            $scope.addThing = function(thing){
                if(!thing) return;
                $scope.selectedUnselectedThing = null;
                $scope.selectedThings.push(thing);

                $timeout(function(){
                    $scope.whenThingChange();
                });
            };

            $scope.removeThing = function(thing){
                if(!thing) return;
                $scope.selectedSelectedThing = null;
                $scope.selectedThings.remove(thing);

                $timeout(function(){
                    $scope.whenThingChange();
                });
            };
            
        }]
    };
  }]);