'use strict';

angular.module('BeehivePortal')
  .directive('scheduleTrigger', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            trigger: '='
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/schedule-trigger/schedule-trigger.template.html',
        controller: ['$scope', '$$Tag', '$$Thing', '$timeout', '$q', '$http', 'TriggerService', '$$Type', '$$Trigger', 'AppUtils', function($scope, $$Tag, $$Thing, $timeout, $q, $http, TriggerService, $$Type, $$Trigger, AppUtils){
            
            $scope.currentStep = 1;
            $scope.triggerWhenConditions = TriggerService.triggerWhenConditions;

            $scope.dataContainer = {
                predicate: {},
                schedule: {},
                myTargets: [],
                targetSchemas: []
            };

            $scope.goStep = function(step){
                if(!$scope.trigger.triggerID) return;
                $scope.currentStep = step;
            };

            $scope.init = function(){
                $scope.dataContainer.predicate = $scope.trigger.predicate;
                $scope.dataContainer.schedule = $scope.trigger.predicate.schedule;
                console.log($scope.dataContainer.schedule);
                //if($scope.dataContainer.schedule)
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

            $scope.previousStep = function(step){
                $scope.currentStep = step - 1;
            };

            $scope.nextStep = function(step){
                switch(step){
                    case 1: 
                        saveSchedule();
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
             * step 1, save schedule
             * @return {[type]} [description]
             */
            function saveSchedule(){
                if($scope.dataContainer.schedule.type == 'Interval'){
                    delete $scope.dataContainer.schedule.cron;
                }else{
                    delete $scope.dataContainer.schedule.timeUnit;
                    delete $scope.dataContainer.schedule.interval;
                    $scope.dataContainer.schedule.cron = '0 ' + $scope.dataContainer.schedule.cron;
                }
                $scope.trigger.setSchedule($scope.dataContainer.schedule);
                delete $scope.trigger.source;
                delete $scope.trigger.predicate.condition;
                console.log($scope.dataContainer.schedule);
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

            /**
             * save trigger
             * @return {[type]} [description]
             */
            function saveTrigger(){
                
                var data = TriggerService.getDataForRequest($scope.trigger, 'Schedule');

                $$Trigger.save(data, function(response){
                    AppUtils.alert('创建触发器成功！');
                    $scope.trigger.triggerID = response.triggerID;
                }, function(err){
                    AppUtils.alert('创建触发器失败！错误信息:' + JSON.stringify(err));
                });
                
            }
        }]
    };
}]);