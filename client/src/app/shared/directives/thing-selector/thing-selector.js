angular.module('BeehivePortal')
  .directive('thingSelector', ['$compile', '$timeout', function($compile, $timeout) {
      return{
        restrict: 'E',
        replace: true,
        scope:{
            selectedThings: '=?',
            selectedThingTypes: '=?'
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

            $scope.thingTypes = [];

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
                
                $scope.allDisabled = !$scope.tagAllowed && !$scope.locationAllowed && !$scope.typeAllowed;

                if($scope.tagAllowed){
                    $scope.dataset.tags = $$Tag.queryAll();
                }

                if($scope.locationAllowed){
                    $$Location.queryAll(function(locations){
                        $scope.dataset.locations = (new LocationTree(_.pluck(locations, 'displayName'))).tree.children;
                    });
                }
            };

            $scope.selectLocation = function(location){
                $$Thing.byTag({tagType: 'Location', displayName: location.id}, function(things){
                    loadThings(things);
                    $timeout(function(){
                        $scope.whenThingChange();
                    });
                });
            };

            $scope.selectTag = function(tag){
                $scope.things = $$Thing.byTag({tagType: 'Custom', displayName: tag.displayName}, function(things){
                    loadThings(things);
                    $timeout(function(){
                        $scope.whenThingChange();
                    });
                });
            };

            function loadThings(things){
                $scope.things = _.filter(things, function(thing){
                    return thing.fullKiiThingID;
                });
            }

            $scope.$watch('selectedThings', function(){
                $scope.whenThingChange();
            });

            $scope.whenThingChange = function(){
                $scope.unselectedThings = _.filter($scope.things, $scope.unselectedFilter);
                $scope.thingTypes = [];
                $scope.selectedTypes = [];

                var types = _.uniq(_.pluck($scope.unselectedThings, 'type'));
                _.each(types, function(type){
                    $scope.thingTypes.push({name: type, children:[]});
                });
                

                _.each($scope.unselectedThings, function(thing){
                    var type = _.find($scope.thingTypes, function(type){
                        return type.name == thing.type;
                    });
                    thing = _.clone(thing);
                    thing.name = thing.vendorThingID + '/' + thing.globalThingID;
                    type.children.push(thing);
                });

                $scope.displayedThings = _.filter($scope.things, function(thing){
                    return _.find($scope.selectedThings, function(selectedThing){
                        return selectedThing == thing.globalThingID;
                    });
                });

                /**
                 * Find things which doesn't have type/tag/location
                 */

                var unknownThings = _.filter($scope.selectedThings, function(thingID){
                    return !_.find($scope.things, function(knownThing){
                        return knownThing.globalThingID == thingID;
                    })
                });

                _.each(unknownThings, function(thingID){
                    $scope.selectedTypes.push({name: thingID, id: thingID});
                });
                

                var selectedTypes = _.uniq(_.pluck($scope.displayedThings, 'type'));

                $scope.selectedThingTypes = selectedTypes;
                _.each(selectedTypes, function(type){
                    $scope.selectedTypes.push({name: type, children:[]});
                });
                

                _.each($scope.displayedThings, function(thing){
                    var type = _.find($scope.selectedTypes, function(type){
                        return type.name == thing.type;
                    });
                    thing = _.clone(thing);
                    thing.name = thing.globalThingID;
                    type.children.push(thing);
                });
            }

            $scope.unselectedFilter = function(thing){
                return !_.find($scope.selectedThings, function(selectedThing){
                    return selectedThing == thing.globalThingID;
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
                $scope.selectedThings = $scope.selectedThings || [];

                $scope.selectedUnselectedThing = null;
                $scope.selectedThings.push(thing.globalThingID);

                $timeout(function(){
                    $scope.whenThingChange();
                });
            };

            $scope.removeThing = function(thing){
                if(!thing) return;
                if(!thing.globalThingID){
                    $scope.selectedThings.remove(thing.id);
                    $scope.whenThingChange();
                    return;
                }
                $scope.selectedSelectedThing = null;
                $scope.selectedThings.remove(thing.globalThingID);

                $timeout(function(){
                    $scope.whenThingChange();
                });
            };
            
        }]
    };
  }]);