angular.module('BeehivePortal')

.directive('thingLocationSelector', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            view: '=monitorView'
        },
        templateUrl: 'app/shared/directives/thing-location-selector/thing-location-selector.template.html',
        controller: ['$scope', '$$Tag', '$$Thing', '$$Location', '$$Type', '$timeout', '$q', '$$User', function($scope, $$Tag, $$Thing, $$Location, $$Type, $timeout, $q, $$User) {
            $scope.view.detail = [];
            if ($scope.view.id !== 0) {
                $$User.getCustomData({ name: 'mv_' + $scope.view.id }).$promise.then(function(res) {
                    $scope.view.detail = res.detail || [];
                })
            }
            $$User.getThings().$promise.then(function(res) {
                $scope.things = res;
            });

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
