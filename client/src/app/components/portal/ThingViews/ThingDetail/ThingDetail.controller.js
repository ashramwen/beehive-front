'use strict';

angular.module('BeehivePortal')
  .controller('ThingDetailController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$uibModal', '$timeout', '$$Trigger', '$log', function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type, $uibModal, $timeout, $$Trigger, $log) {
    $scope.thing = {};
    var globalThingID = $state.params.thingid;

    $scope.init = function(){
        $scope.thing = $$Thing.get({globalThingID: globalThingID}, function(thing){

            $$Thing.getOnboardingInfo({vendorThingID: thing.vendorThingID}, function(onboardingInfo){
                _.extend($scope.thing, onboardingInfo);
                $log.debug(onboardingInfo);
            });
        });

        var startDate = new Date(),
            endDate = new Date();

        startDate.setDate(startDate.getDate() - 1);

        $scope.period = {
            from: startDate,
            to: endDate
        };
        $timeout(function(){
            $scope.$broadcast('rpDatePicker-settime', $scope.period);
            $scope.searchThingCommands();
        });
    };

    $scope.onPeriodChange = function(period){
        $scope.period = period;
    };

    $scope.searchThingCommands = function(){
        var startDate = $scope.period.from,
            endDate = $scope.period.to;

        if(!startDate) return;
        startDate = startDate.getTime();
        endDate = endDate? (endDate.getTime() + 24 * 60 * 60 * 1000 - 1) : null;

        var params = {
            globalThingID: globalThingID,
            start: startDate
        };

        if(endDate){
            params.end = endDate;
        }
        $scope.thingCommands = $$Thing.getCommands(params);
    };

    $scope.refreshStatus = function(){
        $scope.thing = $$Thing.get({globalThingID: $state.params.thingid});
    };

    $scope.$watch('login', function(val){
        if(val){
            $scope.init();
        }
    });


  }]);


