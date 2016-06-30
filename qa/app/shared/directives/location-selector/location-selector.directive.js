'use strict';

angular.module('BeehivePortal')
  .directive('locationSelector', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            selectedLocation: '=?'
        },
        templateUrl: 'app/shared/directives/location-selector/location-selector.template.html',
        controller:['$scope', '$$Location', function($scope, $$Location){

            $$Location.queryAll(function(locations){
                var myLocations = _.pluck(locations, 'displayName');
                $scope.locations = new LocationTree(myLocations).tree.children;
            });

            $scope.selectLocation = function(location, selected){
                if(selected){
                    $scope.selectedLocation = location.id;
                }else{
                    $scope.selectedLocation = null;
                }
            };

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
        }]
    };
  }]);