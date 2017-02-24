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
            hideLast: '=?',
            disabled: '=?'
        },
        templateUrl: 'app/shared/directives/location-selector/location-selector.template.html',
        controller:['$scope', '$$Location', '$q', '$translate', 'LEVELS', function($scope, $$Location, $q, $translate, LEVELS){
            $scope.detail = $scope.detail || [];
            $scope.subLevels = [];

            $scope.levels = _.map(LEVELS, function(level, index){
                var children = [];
                for(var i = index + 1; i< LEVELS.length; i++){
                    children.push(i);
                }
                return {
                    options: [],
                    selected: null,
                    children: children,
                    level: LEVELS[index]
                };
            });

            var translateQuery = _.map($scope.levels, function(l, i){
                return $translate('location.level' + i + '.brev');
            });

            $q.all(translateQuery).then(function(values){
                _.each($scope.levels, function(level, index){
                    level.suffix = values[index];
                });
            });
            
            $scope.$watch('input', function(val){
                $scope.selectedLocation = val;
                $scope.setLocation();
            });

            $$Location.getTopLevel(function(res){
                $scope.levels[0].options = _.map(res, function(option){
                    option._displayName = option.displayName;
                    return option;
                });
                if($scope.levels[0].options.length && !$scope.selectedLocation){
                    $scope.levels[0].selected = $scope.levels[0].options[0];
                    $scope.changeLocation(LEVELS[0]);
                    $scope.$emit('location-loaded');
                }else{
                    $scope.setLocation();
                }
            });

            $scope.setLocation = function(){

                if(!$scope.selectedLocation || !$scope.levels[0].options.length) return;
                $$Location.getParent({location: $scope.selectedLocation}, function(locationList){

                    var $defer = $q.defer();
                    var funcs = [];
                    locationList.reverse();

                    _.each(locationList, function(location, index){
                        var func = (function(location, funcAfter){
                            return function(){
                                var target = $scope.levels.find(function(l){
                                    return l.level === location.level;  
                                });
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
                    if(!firstFunc){
                        $scope.levels[0].selected = _.find($scope.levels[0].options, {location: $scope.selectedLocation});
                        $scope.changeLocation(LEVELS[0]).then(function(){
                            $scope.$emit('location-loaded');
                        });
                        return;
                    }
                    firstFunc();

                    $defer.promise.then(function(obj){
                        obj.selected = _.find(obj.options, {location: $scope.selectedLocation});
                        //var levels = _.keys($scope.levels);

                        $scope.changeLocation($scope.levels[locationList.length].level).then(function(){
                            $scope.$emit('location-loaded');
                        });
                    });

                });
            };
            
            $scope.onChange = function(location, obj){
                $scope.change({location: location, locationName: obj? obj.displayName: '', fullLocation: $scope.levels, displayName: $scope.getDisplayName(), subLevels: $scope.subLevels});
                $scope.$emit('location-change', location);
            };

            $scope.changeLocation = function(level, preventOutput){
                var $defer = $q.defer();
                var targetIndex = _.findIndex($scope.levels, {level: level});
                var target = $scope.levels[targetIndex];
                var parent = $scope.levels[targetIndex - 1];
                var children = target.children;
                _.each(children, function(child){
                    $scope.levels[child].options = [];
                    $scope.levels[child].selected = null;
                });

                if(!target.selected){
                    if(!preventOutput){
                        if(parent){
                            $$Location.getSubLevel({location: parent.selected.location}, function(res){
                                $scope.subLevels = res;
                                $scope.onChange(parent.selected.location, parent.selected);
                            });
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
                var target = $scope.levels[0];
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