'use strict';

angular.module('BeehivePortal')
  .controller('ControlThingController', ['$scope', '$state', 'AppUtils', '$$Thing', '$$Type', 'TriggerService', '$timeout', '$rootScope', function($scope, $state, AppUtils, $$Thing, $$Type, TriggerService, $timeout, $rootScope) {
    
    $scope.init = function(){
        $scope.currentStep = 1;
        $rootScope.$watch('login', function(newVal){
            if(!newVal) return;
            initData();
            $scope.refreshed = true;
        });
    };

    $scope.nextStep = function(step){
        switch(step){
            case 1:
                saveSource();
                break;
            case 2: 
                sendCommand();
                break;
        }
        $scope.currentStep = (step == 2?2: $scope.currentStep+1);
    };

    function saveSource(){
        var type = $scope.dataContainer.mySource.sourceType;
        if(type == 'tag'){
            if($scope.dataContainer.mySource.thingList){
                delete $scope.dataContainer.mySource.thingList;
            }
            $scope.dataContainer.mySource.type = $scope.dataContainer.mySource.selectedType.id;
        }else{
            if($scope.dataContainer.mySource.tagList){
                delete $scope.dataContainer.mySource.tagList;
            }
        }
        var source = $scope.dataContainer.mySource;
        
        TriggerService.getSourceTypes(source).then(function(types){
            TriggerService.getTypeSchemas(types).then(function(schemas){
                $scope.dataContainer.sourceSchema = schemas[0];
            });
        });
    }

    function initData(){
        $scope.dataContainer = {
            mySource: {},
            command: {}
        };
        
    }

    function sendCommand(){
        var schemas = $scope.dataContainer.sourceSchema,
            actions = [];

        _.each(schemas.actions, function(action, actionName){
            var actionToAdd = {},
                addFlag = false;
                actionToAdd[actionName] = {};

            if(action._checked){
                _.each(action.in.properties, function(propertyValue, propertyName){
                    if(propertyValue._checked){
                        actionToAdd[actionName][propertyName] = propertyValue.value;
                        addFlag = true;
                    }
                })
            }
            if(addFlag){
                actions.push(actionToAdd);
            }
        });

        var fieldsExisting = ['thingList', 'tagList', 'andExpress', 'type'];
        _.each($scope.dataContainer.mySource, function(value, key){
            if(fieldsExisting.indexOf(key) == -1){
                delete $scope.dataContainer.mySource[key];
            }
        });
        var command = new BeehiveCommand(),
            commands = [];

        _.extend(command, $scope.dataContainer.mySource);
        command.command.actions = actions;

        commands.push(command);


        $$Thing.sendCommand(commands, function(){
            initData();
            AppUtils.alert('命令已发送成功', '提示信息');
            $scope.refreshed = false;
            $timeout(function(){
                $scope.refreshed = true;
            });
        });
    }

  }]);