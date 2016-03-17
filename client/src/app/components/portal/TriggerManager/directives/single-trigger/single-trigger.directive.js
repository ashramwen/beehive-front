'use strict';

angular.module('BeehivePortal')
  .directive('singleTrigger', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            trigger: '='
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/single-trigger/single-trigger.template.html',
        controller: ['$scope', '$$Tag', '$$Thing', '$timeout', '$q', '$http', 'TriggerService', '$$Type', '$$Trigger', function($scope, $$Tag, $$Thing, $timeout, $q, $http, TriggerService, $$Type, $$Trigger){
            
            $scope.currentStep = 1;
            $scope.triggerWhenConditions = TriggerService.triggerWhenConditions;

            $scope.dataContainer = {
                predicate: {
                    triggersWhen: null,
                    condition: {}
                },
                sourceSchema: null,
                myTargets: [],
                targetSchemas: []
            };

            $scope.init = function(){
                var thingID = $scope.trigger.source.thingID;

                $$Thing.get({globalThingID: thingID}, function(thing){
                    $scope.dataContainer.sourceSchema = TriggerService.getSchemaByType(thing.type);
                });
            };

            $scope.previousStep = function(step){
                $scope.currentStep = step - 1;
            };

            $scope.nextStep = function(step){
                switch(step){
                    case 1: 
                        saveCondition();
                        break;
                    case 2:
                        saveTargets();
                        break;
                    case 3:
                        saveTriggerCommand();
                        saveTrigger();
                        break;
                }
                $scope.currentStep = $scope.currentStep > 2?$scope.currentStep: step + 1;
                console.log(JSON.stringify($scope.trigger));
            };

            $scope.createTarget = function(){
                $scope.dataContainer.myTargets.splice(0, 0, new TriggerTarget());
            };

            /**
             * step 1, save single trigger's trigger condition
             * @return {[type]} [description]
             */
            function saveCondition(){
                $scope.trigger.setTriggersWhen($scope.dataContainer.predicate.triggersWhen);
                $scope.trigger.setCondition($scope.dataContainer.predicate.condition);
            }

            /**
             * step 2, save summary trigger's trigger target
             * @return {[type]} [description]
             */
            function saveTargets(){
                var newSources = [];
                $scope.dataContainer.targetSchemas = [];
                _.each($scope.dataContainer.myTargets, function(source, index){
                    var newSource = new TriggerTarget();
                    var sourceObj = {};
                    if(source.thingList){
                        sourceObj.thingList = source.thingList;
                    }else{
                        sourceObj.tagList = source.tagList;
                        sourceObj.andExpress = source.andExpress;
                        sourceObj.type = source.selectedType.id;
                    }

                    $scope.dataContainer.targetSchemas.push({});

                    TriggerService.getSourceTypes(source).then(function(types){
                        TriggerService.getTypeSchemas(types).then(function(schemas){
                            $scope.dataContainer.targetSchemas[index] = TriggerService.xSchemas(schemas);
                        });
                    });

                    newSource.setSource(sourceObj, source.sourceType, source.andExpress);
                    newSources.push(newSource);
                });

                $scope.trigger.setTargets(newSources);
            }

            /**
             * step 3, save summary trigger's command after the trigger is triggered.
             * @return {[type]} [description]
             */
            function saveTriggerCommand(){
                _.each($scope.dataContainer.targetSchemas, function(targetSchema, index){
                    $scope.trigger.targets[index].command.actions = [];
                    _.each(targetSchema.actions, function(action, actionName){
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
                            $scope.trigger.targets[index].command.actions.push(actionToAdd);
                        }
                    });
                });
            }

            function saveTrigger(){
                $$Trigger.save($scope.trigger);
            }
        }]
    };
}]);