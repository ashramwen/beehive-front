'use strict';

angular.module('BeehivePortal')
  .controller('ThingDetailController', ['$scope', '$rootScope', 'AppUtils', '$timeout', '$log', '$q', 'ThingDetailService', 'TriggerDetailService', '$$Thing', '$uibModal', '$$Type', function($scope, $rootScope, AppUtils, $timeout, $log, $q, ThingDetailService, TriggerDetailService, $$Thing, $uibModal, $$Type) {
    $scope.thing = {};
    var globalThingID = ~~$scope.$state.params.thingid;
    $scope.statePageIndex = 0;
    $scope.thingStateList = [];
    $scope.thingProperties = [];


    $scope.init = function(){

        ThingDetailService.getThing(globalThingID).then(function(thing){
            $scope.thing = thing;
            $$Type.getSchema({type: $scope.thing.type}, function(schema){
                $scope.schema = TriggerDetailService.parseSchema(schema);
            });
            $timeout(function(){
                $scope.$broadcast('rpDatePicker-settime', $scope.controlPeriod);
                $scope.searchThingCommands();
            });
        });
        var startDate = new Date(),
            endDate = new Date();

        startDate.setDate(startDate.getDate() - 1);

        $scope.controlPeriod = {
            from: startDate,
            to: endDate
        };

        $scope.statePeriod = {
            from: startDate,
            to: endDate
        };
    };

    $scope.onControlPeriodChange = function(period){
        $scope.controlPeriod = period;
    };

    $scope.onStatePeriodChange = function(period){
        $scope.statePeriod = period;
    };

    $scope.searchThingStates = function(){
        var periodIsChanged = $scope.statePeriodIsChanged();

        $scope.queriedStatePeriod = angular.copy($scope.statePeriod);

        if(periodIsChanged){
            $scope.statePageIndex = 0;
        }
        ThingDetailService.getThingHistoryState($scope.thing.vendorThingID, $scope.statePageIndex, $scope.queriedStatePeriod.from, $scope.queriedStatePeriod.to)
            .then(function(result){
                console.log(result);
                if(periodIsChanged){
                    $scope.thingStateList = new Array(result.total || 0);
                }
                var i = 0;
                while(i< result.states.length){
                    $scope.thingStateList[result.from + i] = result.states[i++];
                }

            });
    };

    $scope.statePeriodIsChanged = function(){
        return !$scope.queriedStatePeriod || !($scope.queriedStatePeriod.from.getTime() == $scope.statePeriod.from.getTime() &&
            $scope.queriedStatePeriod.to.getTime() == $scope.statePeriod.to.getTime() );
    };

    $scope.thingStateIndexChanged = function(index){
        $scope.statePageIndex = index - 1;
        $scope.searchThingStates();
    };

    $scope.searchThingCommands = function(){
        var startDate = $scope.controlPeriod.from,
            endDate = $scope.controlPeriod.to;

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

    $scope.refreshStates = function(){
        ThingDetailService.getThing(globalThingID).then(function(thing){
            $scope.thing = thing;
        });
    };

    $scope.$watch('login', function(val){
        if(val){
            $scope.init();
        }
    });

    $scope.sendCommand = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'ThingDetailController.SendCommand',
            controller: 'ThingDetailController.SendCommand',
            size: 'md',
            resolve: {
              thingID: function () {
                return globalThingID;
              },
              schema: function() {
                return $scope.schema;
              }
            }
        });
    };


  }])
  .controller('ThingDetailController.SendCommand', ['$scope', 'thingID', 'schema', '$uibModalInstance', '$$Thing', function($scope, thingID, schema, $uibModalInstance, $$Thing){

    $scope.actions = angular.copy(schema.actions);

    $scope.actionGroup = {
      type: schema.name, 
      typeDisplayName: schema.displayName,
      actions: []
    };

    $scope.toggleAction = function(action){
      if(!action._selected){
        var _action = AppUtils.clone(action);
        $scope.actionGroup.actions.push(_action);
        delete _action._selected;
      }else{
        $scope.actionGroup.actions = _.reject($scope.actionGroup.actions, {actionName: action.actionName});
      }

      action._selected = !action._selected;
    };

    $scope.sendCommand = function(){

        var command = {
            thingList: [thingID],
            command: {
                schema: schema.name,
                schemaVersion: schema.version,
                actions: []
            }
        };

        var flag = false;

        command.command.actions = _.map($scope.actionGroup.actions, function(action){
            var actionObj = {};
            actionObj[action.actionName] = {};
            _.each(action.properties, function(property){
                actionObj[action.actionName][property.propertyName] = property.value;
                if(_.isNaN(property.value) || _.isNull(property.value)){
                  flag = true;
                }
            });
            return actionObj;
        });

        if(flag){
          AppUtils.alert({msg: '属性值不能为空'});
          return;
        }
        
        if(!command.command.actions.length){
          AppUtils.alert({msg: 'thingViews.actionRequired'});
          return;
        }

        $$Thing.sendCommand([command], function(){
            $uibModalInstance.close();
        });
    };

  }]);


