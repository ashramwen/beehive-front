angular.module('BeehivePortal')

.directive('thingLocationSelector', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            view: '=monitorView'
        },
        templateUrl: 'app/shared/directives/thing-location-selector/thing-location-selector.template.html',
        controller: ['$scope', '$timeout', '$q', '$$User', '$$Location', function($scope, $timeout, $q, $$User, $$Location) {
            $scope.location = {};
            $scope.level = {};
            $scope.view.detail = [];

            // get all things
            // $$User.getThings().$promise.then(function(res) {
            //     $scope.things = res;
            // });

            if ($scope.view.id !== 0) {
                $$User.getCustomData({ name: 'mv_' + $scope.view.id }).$promise.then(function(res) {
                    $scope.view.detail = res.detail || [];
                })
            }

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

            $scope.add = function() {
                var i = 0;
                for (; i < $scope.things.length; i++) {
                    if (!$scope.things[i].select) continue;
                    $scope.things[i].select = false;
                    if (!_.find($scope.view.detail, function(thing) {
                            return thing.globalThingID === $scope.things[i].globalThingID;
                        }))
                        $scope.view.detail.push(angular.copy($scope.things[i]));
                }
            }
        }]
    };
}]);
