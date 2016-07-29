angular.module('BeehivePortal')

.directive('thingLocationSelector', [function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            detail: '=ngDetail'
        },
        templateUrl: 'app/shared/directives/thing-location-selector/thing-location-selector.template.html',
        controller: ['$scope', '$$User', '$$Location', function($scope, $$User, $$Location) {
            $scope.location = {};
            $scope.level = {};
            $scope.detail = $scope.detail || [];

            // get all things
            // $$User.getThings().$promise.then(function(res) {
            //     $scope.things = res;
            // });

            // if ($scope.view.id !== 0) {
            //     $$User.getCustomData({ name: 'mv_' + $scope.view.id }).$promise.then(function(res) {
            //         $scope.detail = res.detail || [];
            //     })
            // }

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
                $$Location.getThingsByLocation({ location: $scope.level.area.location }).$promise.then(function(res) {
                    $scope.things = res;
                });
            }

            $scope.selectAll = function(things) {
                var i = 0;
                for (; i < things.length; i++) {
                    things[i].select = true;
                }
            }

            $scope.delete = function(things) {
                var i = things.length - 1;
                for (; i >= 0; i--) {
                    if (things[i].select) {
                        things.splice(i, 1);
                    }
                }
            }

            $scope.add = function() {
                var i = 0;
                for (; i < $scope.things.length; i++) {
                    if (!$scope.things[i].select) continue;
                    $scope.things[i].select = false;
                    if (!_.find($scope.detail, function(thing) {
                            return thing.globalThingID === $scope.things[i].globalThingID;
                        }))
                        $scope.detail.push(angular.copy($scope.things[i]));
                }
            }
        }]
    };
}]);