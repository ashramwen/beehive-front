angular.module('BeehivePortal')

.directive('thingLocationSelector', [function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            detail: '=ngDetail'
        },
        templateUrl: 'app/shared/directives/thing-location-selector/thing-location-selector.template.html',
        controller: ['$scope', '$$Location', function($scope, $$Location) {
            $scope.location = {};
            $scope.level = {};
            $scope.detail = $scope.detail || [];

            $$Location.getTopLevel().$promise.then(function(res) {
                $scope.location.building = res;
            });

            $scope.changeBuilding = function() {
                $scope.location.floor = [];
                $scope.location.area = [];
                $scope.things = [];
                $$Location.getSubLevel({ location: $scope.level.building.location }).$promise.then(function(res) {
                    $scope.location.floor = res;
                });
            }

            $scope.changeFloor = function() {
                $scope.location.area = [];
                $scope.things = [];
                $$Location.getSubLevel({ location: $scope.level.floor.location }).$promise.then(function(res) {
                    $scope.location.area = res;
                });
            }

            $scope.changeArea = function() {
                $scope.things = [];
                // $$Location.getThingsByLocation({ location: $scope.level.area.location }).$promise.then(function(res) {
                //     $scope.things = res;
                // });
                $$Location.getAllThingsByLocation({ location: $scope.level.area.location }).$promise.then(showData);
            }

            function showData(things) {
                var thing;
                $scope.detail.forEach(function(o) {
                    thing = _.findWhere(things, { id: o.id });
                    if (thing) thing.hidden = true;
                });
                $scope.things = things;
            }

            $scope.selectAll = function(things) {
                var i = 0;
                for (; i < things.length; i++) {
                    things[i].select = true;
                }
            }

            $scope.delete = function(things) {
                var i = things.length - 1;
                var thing;
                for (; i >= 0; i--) {
                    if (things[i].select) {
                        thing = _.findWhere($scope.things, { id: things[i].id });
                        if (thing) thing.hidden = false;
                        things.splice(i, 1);
                    }
                }
            }

            $scope.add = function() {
                var i = 0;
                for (; i < $scope.things.length; i++) {
                    if (!$scope.things[i].select) continue;
                    $scope.things[i].select = false;
                    $scope.things[i].hidden = true;
                    if (!_.findWhere($scope.detail, { id: $scope.things[i].id }))
                        $scope.detail.push(angular.copy($scope.things[i]));
                }
                // $scope.detail.sort(function(a, b) {
                //     return a.id - b.id;
                // });
            }
        }]
    };
}]);