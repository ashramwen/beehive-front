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
        controller: ['$scope', '$$Tag', '$$Thing', '$timeout', '$q', '$http', 'TriggerService', '$$Type', '$$Trigger', 'AppUtils', function($scope, $$Tag, $$Thing, $timeout, $q, $http, TriggerService, $$Type, $$Trigger, AppUtils){
            
            $scope.currentStep = 1;
            $scope.triggerWhenConditions = TriggerService.triggerWhenConditions;

            $scope.dataContainer = {
                schedule:{},
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
                    $scope.dataContainer.predicate = $scope.trigger.predicate;
                });
                
                $scope.dataContainer.schedule = $scope.trigger.predicate.schedule || {};
                if($scope.trigger.predicate.schedule){
                    $scope.dataContainer.schedule.enabled = true;
                    if($scope.dataContainer.schedule.cron){
                        $scope.dataContainer.schedule.cron = TriggerService.revertCron($scope.dataContainer.schedule.cron);
                    }
                }
                _.each($scope.trigger.targets, function(target, index){
                    $scope.dataContainer.myTargets.push(target);

                    $scope.dataContainer.targetSchemas.push({});

                    TriggerService.getSourceTypes(target).then(function(types){
                        $scope.trigger.targets.thingTypes = types;
                        TriggerService.getTypeSchemas(types).then(function(schemas){
                            $scope.dataContainer.targetSchemas[index] = TriggerService.xSchemas(schemas);
                            TriggerService.initTargetSchema(target, $scope.dataContainer.targetSchemas[index]);
                        });
                    });

                });
            };

            $scope.goStep = function(step){
                if(!$scope.trigger.triggerID) return;
                $scope.currentStep = step;
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
                saveSchedule();
            }

            /**
             * step 1, save schedule
             * @return {[type]} [description]
             */
            function saveSchedule(){
                if($scope.dataContainer.schedule.enabled){
                    var schedule = _.clone($scope.dataContainer.schedule);
                    if(schedule.type == 'Interval'){
                        delete schedule.cron;
                    }else{
                        delete schedule.timeUnit;
                        delete schedule.interval;
                        schedule.cron = TriggerService.getRightCron(schedule.cron);
                    }
                    $scope.trigger.setSchedule(schedule);
                }else{
                    delete $scope.trigger.predicate.schedule;
                }
            };

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
                $$Trigger.save($scope.trigger, function(response){
                    $scope.trigger.triggerID = response.triggerID;
                    AppUtils.alert('创建触发器成功！');
                    console.log(response);
                }, function(err){
                    AppUtils.alert('创建触发器失败！错误信息:' + err);
                });
                
            }
        }]
    };
}]);