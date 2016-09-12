'use strict';

angular.module('BeehivePortal')
  .controller('ThingDetailController', ['$scope', '$rootScope', 'AppUtils', '$timeout', '$log', '$q', 'ThingDetailService', '$$Thing', function($scope, $rootScope, AppUtils, $timeout, $log, $q, ThingDetailService, $$Thing) {
    $scope.thing = {};
    var globalThingID = ~~$scope.$state.params.thingid;

    $scope.init = function(){

        ThingDetailService.getThing(globalThingID).then(function(thing){
            $scope.thing = thing;
            $timeout(function(){
                $scope.$broadcast('rpDatePicker-settime', $scope.period);
                $scope.searchThingCommands();
            });
        });
        var startDate = new Date(),
            endDate = new Date();

        startDate.setDate(startDate.getDate() - 1);

        $scope.period = {
            from: startDate,
            to: endDate
        };
    };

    $scope.onPeriodChange = function(period){
        $scope.period = period;
    };

    $scope.searchThingCommands = function(){
        var startDate = $scope.period.from,
            endDate = $scope.period.to;

        if(!startDate) return;
        startDate = startDate.getTime();
        endDate = endDate? endDate.getTime() : null;

        var params = {
            globalThingID: globalThingID,
            start: startDate
        };

        if(endDate){
            params.end = endDate;
        }
        $$Thing.getCommands(params, function(thingCommands){
            $scope.thingCommands = thingCommands;
            _.each($scope.thingCommands, function(command){
                command.actionNames = _.map(command.actions, function(action){
                    var actionName = _.keys(action)[0];
                    return _.find($scope.thing.actions, {actionName: actionName}).displayName;
                });
            });
        });
    };

    $scope.refreshStatus = function(){
        ThingDetailService.getThing(globalThingID).then(function(thing){
            $scope.thing = thing;
        });
    };

    $scope.$watch('login', function(val){
        if(val){
            $scope.init();
        }
    });


  }]);


