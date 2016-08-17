'use strict';

angular.module('BeehivePortal')
  .directive('locationSelector', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            change: '&',
            input: '=?',
            position: '=?',
            hideLast: '=?'
        },
        templateUrl: 'app/shared/directives/location-selector/location-selector.template.html',
        controller:['$scope', '$$Location', '$q', function($scope, $$Location, $q){
            $scope.detail = $scope.detail || [];
            $scope.subLevels = [];

            $scope.levels = {
                "building": {
                    "options": [],
                    "suffix": '楼',
                    "selected": null,
                    "parent": null,
                    "children": ['floor', 'partition', 'area']
                },
                "floor": {
                    "options": [],
                    "suffix": '层',
                    "selected": null,
                    "parent": 'building',
                    "children": ['partition', 'area']
                },
                "partition": {
                    "options": [],
                    "suffix": '区域',
                    "selected": null,
                    "parent": 'floor',
                    "children": ['area']
                },
                "area": {
                    "options": [],
                    "suffix": '区块',
                    "selected": null,
                    "parent": 'partition',
                    "children": []
                }
            };

            $scope.$watch('input', function(val){
                $scope.selectedLocation = val;
                $scope.setLocation();
            });

            $$Location.getTopLevel(function(res){
                $scope.levels['building'].options = _.map(res, function(option){
                    option._displayName = option.displayName;
                    return option;
                }) ;
                $scope.setLocation();
            });

            $scope.setLocation = function(){

                if(!$scope.selectedLocation || !$scope.levels.building.options.length) return;
                $$Location.getParent({location: $scope.selectedLocation}, function(locationList){

                    var $defer = $q.defer();
                    var funcs = [];
                    locationList.reverse();

                    _.each(locationList, function(location, index){
                        var func = (function(location, funcAfter){
                            return function(){
                                var target = $scope.levels[location.level];
                                target.selected = _.find(target.options, {location: location.location});
                                if(funcAfter){
                                    $scope.changeLocation(location.level, true).then(funcAfter);
                                }else{

                                    $scope.changeLocation(location.level, true).then(function(){
                                        $defer.resolve($scope.levels[target.children[0]]);
                                    });
                                }
                            };
                        })(location, funcs[index - 1]);
                        funcs.push(func);
                    });

                    var firstFunc = funcs[funcs.length - 1];
                    firstFunc();

                    $defer.promise.then(function(obj){
                        obj.selected = _.find(obj.options, {location: $scope.selectedLocation});
                        $scope.$emit('location-loaded');
                    });

                });
            };
            
            $scope.onChange = function(location, obj){
                $scope.change({location: location, locationName: obj.displayName, fullLocation: $scope.levels, displayName: $scope.getDisplayName(), subLevels: $scope.subLevels});
                $scope.$emit('location-change', location);
            };

            $scope.changeLocation = function(level, preventOutput){
                var $defer = $q.defer();
                var children = $scope.levels[level].children;
                _.each(children, function(child){
                    $scope.levels[child].options = [];
                    $scope.levels[child].selected = null;
                });

                var target = $scope.levels[level];

                if(!target.selected){
                    if(!preventOutput){
                        var parent = null;
                        if(target.parent){
                            parent = $scope.levels[target.parent];
                            $scope.onChange(parent.selected.location, parent.selected);
                        }else{
                            $scope.onChange(null);
                        }
                    }
                    return;
                }

                if(target.children.length>0){
                    $$Location.getSubLevel({location: target.selected.location}, function(res){
                        $scope.levels[target.children[0]].options = _.map(res, function(option){
                            option._displayName = option.displayName.substr(target.selected.displayName.length).replace('-', '');
                            return option;
                        });
                        $scope.subLevels = res;

                        if(!preventOutput){
                            $scope.onChange(target.selected.location, target.selected);
                        }
                        $defer.resolve($scope.subLevels);
                    });
                }else{
                    $scope.subLevels = [];
                    if(!preventOutput){
                        $scope.onChange(target.selected.location, target.selected);
                    }
                    $defer.resolve($scope.subLevels);
                }
                return $defer.promise;
            }

            $scope.getDisplayName = function(){
                if(_.isEmpty($scope.levels.building.selected)){
                    return '请选择';
                }
                var target = $scope.levels.building;
                var displayNames = [];
                while(target && target.selected){
                    displayNames.push(target.selected._displayName + target.suffix);
                    target = $scope.levels[target.children[0]];
                }
                if(displayNames.length > 0){
                    return displayNames.join(' ');
                }else{
                    return '请选择';
                }
            };
        }]
    };
  }]);