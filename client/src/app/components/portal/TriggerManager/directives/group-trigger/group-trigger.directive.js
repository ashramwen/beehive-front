'use strict';

angular.module('BeehivePortal')
  .directive('groupTrigger', ['$compile', '$$Tag', '$$Thing', '$timeout', '$uibModal', '$$Type', function($compile, $$Tag, $$Thing, $timeout, $uibModal, $$Type){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            trigger: '='
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/group-trigger/group-trigger.template.html',
        controller: ['$scope', '$$Tag', '$$Thing', '$timeout', '$q', '$http', 'TriggerService', '$$Type', '$$Trigger', function($scope, $$Tag, $$Thing, $timeout, $q, $http, TriggerService, $$Type, $$Trigger){

            var data = {
                'predicate': {
                    "eventSource" : "states",
                    "triggersWhen" : "CONDITION_FALSE_TO_TRUE",
                    "condition" : {
                        "clauses" : [ {
                            "field" : "brightness",
                            "upperLimit" : 100,
                            "upperIncluded" : false,
                            "lowerIncluded" : false,
                            "type" : "range"
                        },
                        {
                            "field": "brightness",
                            "lowerLimit": 50,
                            "lowerIncluded": true,
                            "type": "range"
                        }
                        ],
                        "type" : "or"
                    }
                },
                'targets': [{
                    "command" : {
                        "actions" : [ {
                            "turnPower" : {
                              "power" : true
                            }
                        } ],
                        "schemaVersion" : 0,
                        "metadata" : { }
                    },
                    'tagList': ['Custom-智能设备'],
                    'andExpress': false
                }],
                "policy" : {
                    "groupPolicy" : "Percent",
                    "criticalNumber" : 75
                },
                'source': {
                    'tagList': ['Custom-识别设备'],
                    'andExpress': false
                }
            };

            //_.extend($scope.trigger, data);

            $scope.myTrigger = _.clone($scope.trigger);
            $scope.dataContainer = {};

            $scope.currentStep = 1;

            $scope.triggerWhenConditions = TriggerService.triggerWhenConditions;

            /**
             * [init description]
             * @return {[type]} [description]
             */
            $scope.init = function(){
                var extraData = {};
                $scope.dataContainer = {
                    mySource: {
                        thingType: $scope.myTrigger.source.thingType,
                        thingList: _.clone($scope.myTrigger.source.thingList),
                        tagList: _.clone($scope.myTrigger.source.tagList),
                        andExpress: $scope.myTrigger.source.andExpress
                    },
                    predicate: null,
                    sourceSchema: null,
                    myTargets: [],
                    targetSchemas: []
                };

                TriggerService.getSourceTypes($scope.dataContainer.mySource).then(function(types){
                    $scope.dataContainer.mySource.thingTypes = types;

                    if($scope.dataContainer.mySource.thingType){

                        TriggerService.getSchemaByType($scope.dataContainer.mySource.thingType).$promise.then(
                            function(schema){
                                $scope.dataContainer.predicate = $scope.myTrigger.predicate;
                                $scope.dataContainer.sourceSchema = schema;
                            },
                            function(){

                            }
                        );
                    }else{
                        TriggerService.getTypeSchemas(types).then(function(schemas){
                            $scope.dataContainer.predicate = $scope.myTrigger.predicate;
                            $scope.dataContainer.sourceSchema = TriggerService.xSchemas(schemas);
                        });
                    }
                });

                _.each($scope.myTrigger.targets, function(target, index){
                    TriggerService.getSourceTypes(target).then(function(types){
                        $scope.dataContainer.myTargets.push({
                            tagList: target.tagList,
                            thingList: target.thingList,
                            andExpress: target.andExpress,
                            thingType: target.thingType,
                            thingTypes: types
                        });

                        $scope.dataContainer.targetSchemas.push({});

                        var selectedTypes;
                        if(target.thingType){
                            selectedTypes = [target.thingType];
                        }else{
                            selectedTypes = types;
                        }
                        TriggerService.getTypeSchemas(selectedTypes).then(function(schemas){
                            var schema = TriggerService.xSchemas(schemas);
                            initTargetSchema(target, schema);
                            $scope.dataContainer.targetSchemas[index] = schema;
                        });

                    });
                });
            };

            function initTargetSchema(target, schema){
                _.each(target.command.actions, function(action){
                    _.each(action, function(actionContent, actionName){
                        schema.actions[actionName]._checked = true;
                        _.each(actionContent, function(propertyValue, propertyName){
                            schema.actions[actionName].in.properties[propertyName].value = propertyValue;
                            schema.actions[actionName].in.properties[propertyName]._checked = true;
                        });
                    });
                });
            }

            $scope.previousStep = function(step){
                $scope.currentStep = step - 1;
            };

            $scope.nextStep = function(step){
                switch(step){
                    case 1: 
                        saveSource();
                        break;
                    case 2: 
                        saveCondition();
                        break;
                    case 3:
                        saveTarget();
                        break;
                    case 4:
                        saveTriggerCommand();
                        saveTrigger();
                        break;
                }
                $scope.currentStep = $scope.currentStep > 3?$scope.currentStep: step + 1;
                console.log(JSON.stringify($scope.myTrigger));
            };

            $scope.createTarget = function(){
                $scope.dataContainer.myTargets.splice(0, 0, new TriggerTarget());
            };

            /**
             * step 1, save summary trigger's trigger source
             * @return {[type]} [description]
             */
            function saveSource (){
                if($scope.dataContainer.mySource.sourceType == 'tag'){
                    if($scope.dataContainer.mySource.thingList){
                        delete $scope.dataContainer.mySource.thingList;
                    }
                }else{
                    if($scope.dataContainer.mySource.tagList){
                        delete $scope.dataContainer.mySource.tagList;
                    }
                }
                
                TriggerService.getSourceTypes($scope.dataContainer.mySource).then(function(types){
                    if($scope.dataContainer.mySource.sourceType == 'tag'){
                        $scope.myTrigger.source.type = $scope.dataContainer.mySource.selectedType;
                    }
                    TriggerService.getTypeSchemas(types).then(function(schemas){
                        $scope.dataContainer.sourceSchema = TriggerService.xSchemas(schemas);
                    });
                });
                $scope.myTrigger.setSource($scope.dataContainer.mySource, $scope.dataContainer.mySource.sourceType);
            }

           
            /**
             * step 2, save group trigger's trigger condition
             * @return {[type]} [description]
             */
            function saveCondition(){
                $scope.myTrigger.setTriggersWhen($scope.dataContainer.predicate.triggersWhen);
                $scope.myTrigger.setCondition($scope.dataContainer.predicate.condition);
            }

            /**
             * step 3, save summary trigger's trigger target
             * @return {[type]} [description]
             */
            function saveTarget(){
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

                $scope.myTrigger.setTargets(newSources);
            }

            /**
             * step 4, save summary trigger's command after the trigger is triggered.
             * @return {[type]} [description]
             */
            function saveTriggerCommand(){
                _.each($scope.dataContainer.targetSchemas, function(targetSchema, index){
                    $scope.myTrigger.targets[index].command.actions = [];
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
                            $scope.myTrigger.targets[index].command.actions.push(actionToAdd);
                        }
                    });
                });
            }

            function saveTrigger(){
                $$Trigger.save($scope.myTrigger);
            }
        }]
    };
  }])
  .controller('summaryTrigger.CreateSource', ['$uibModalInstance', '$scope', function($uibModalInstance, $scope){

    $scope.createSource = function(name){
        var source = {name: name};
        $uibModalInstance.close(source);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  }]);