'use strict';

angular.module('BeehivePortal')
  .controller('ControlThingController', ['$scope', '$state', 'AppUtils', '$$Thing', '$$Type', 'TriggerDetailService', '$timeout', '$rootScope', function($scope, $state, AppUtils, $$Thing, $$Type, TriggerDetailService, $timeout, $rootScope) {
    
    $scope.schema = null;
    $scope.actionGroup = {
      type: null, 
      typeDisplayName: '', 
      things: [],
      actions: []
    };


    $scope.init = function(){

    };

    
    $scope.selectedChange = function(things, type){
      if(type != $scope.selectedType){
        $scope.selectedType = type;
        $$Type.getSchema({type: type}, function(schema){
          var _schema = TriggerDetailService.parseSchema(schema);
          $scope.schema = _schema;
          $scope.actions = _schema.actions;

          $scope.actionGroup = {
            type: type, 
            typeDisplayName: _schema.displayName,
            actions: [],
            things: things
          };
        });
      }
      
      $scope.actionGroup.things = things;
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
            thingList: _.pluck($scope.actionGroup.things, 'globalThingID'),
            command: {
                schema: $scope.schema.name,
                schemaVersion: $scope.schema.version,
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

        if(!command.thingList.length){
          AppUtils.alert({msg: 'thingViews.thingsRequired'});
          return;
        }else if(!command.command.actions.length){
          AppUtils.alert({msg: 'thingViews.actionRequired'});
          return;
        }

        $$Thing.sendCommand([command], function(){
            AppUtils.alert({msg: 'thingManager.commandSentMsg'});
            $state.go($state.current.name, {refreshId: ~~(Math.random()*100)});
            $scope.refreshed = false;
            $timeout(function(){
                $scope.refreshed = true;
            });
        });
    }

  }]);