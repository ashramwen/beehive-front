'use strict';

angular.module('BeehivePortal')
  .directive('locationSelector', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            change: '&'
        },
        templateUrl: 'app/shared/directives/location-selector/location-selector.template.html',
        controller:['$scope', '$$Location', function($scope, $$Location){
            $scope.location = {};
            $scope.level = {};
            $scope.detail = $scope.detail || [];

            $$Location.getTopLevel().$promise.then(function(res) {
                $scope.location.building = res;
            });

            $scope.onChange = function(location){
                $scope.change({location: location, fullLocation: $scope.level, displayName: $scope.displayName});
                $scope.$emit('location-change', location);
            };

            $scope.changeBuilding = function() {
                $scope.location.floor = [];
                $scope.location.area = [];

                $scope.level.floor = null;
                $scope.level.area = null;

                if(!$scope.level.building){
                    $scope.onChange(null);
                    return;
                }

                $$Location.getSubLevel({ location: $scope.level.building.location }).$promise.then(function(res) {
                    $scope.location.floor = res;
                });
                $scope.onChange($scope.level.building.location);
            };

            $scope.changeFloor = function() {
                $scope.location.area = [];
                $scope.level.area = null;
                $scope.things = [];

                if(!$scope.level.floor){
                    $scope.onChange($scope.level.building.location);
                    return;
                }

                $$Location.getSubLevel({ location: $scope.level.floor.location }).$promise.then(function(res) {
                    $scope.location.area = res;
                });
                $scope.onChange($scope.level.floor.location);
            };

            $scope.changeArea = function() {
                $scope.things = [];
                if(!$scope.level.area){
                    $scope.onChange($scope.level.floor.location);
                    return;
                }
                $scope.onChange($scope.level.area.location);
            };

            $scope.getDisplayName = function(){
                if(_.isEmpty($scope.level.building)){
                    return '请选择';
                }
                var displayName = $scope.level.building.displayName + '楼';
                if(_.isEmpty($scope.level.floor)) return displayName;
                displayName += ' ' + $scope.level.floor.displayName + '层';
                if(_.isEmpty($scope.level.area)) return displayName;
                displayName += ' ' + $scope.level.area.displayName + '区域';
                return displayName;
            };
        }]
    };
  }]);