/*
{
    "type" : "Summary",
    "perdicate" : {
        "eventSource" : "states",
        "triggersWhen" : "CONDITION_TRUE",
        "condition" : {
            "field" : "source.sum_number",
            "value" : "$(target.sum_num)",
            "type" : "eq"
        }
    },
    "targets": [
        {
            "command": {
                "actions": [
                    {
                        "powerOn" : {
                            "power" : true
                        }
                    }
                ],
                "schemaVersion" : 0,
                "metadata" : { }
            }
        } 
    ],
    "summarySource" : {
        "a": {
            "expressList" : [
                {
                    "stateName" : "foo",
                    "function" : "Sum",
                    "summaryAlias" : "sum_number"
                },
                {
                    "stateName" : "bar",
                    "function" : "Avg",
                    "summaryAlias" : "avg_number"
                }
            ],
            "source" : {
                "thingList" : [ ],
                "tagList" : [ "Custom-name0", "Custom-name1" ],
                "andExpress" : false
            }
        },
        "b" : {
            "expressList": [
                {
                    "stateName" : "foo",
                    "function" : "Sum",
                    "summaryAlias" : "sum_num"
                }, {
                    "stateName" : "bar",
                    "function" : "Avg",
                    "summaryAlias" : "avg_num"
                } 
            ],
            "source": {
                "thingList": [ ],
                "tagList": ["Custom-name2", "Custom-name3" ],
                "andExpress": false
            }
        }
    }
}
*/

angular.module('BeehivePortal')
  .directive('summaryTrigger', ['$compile', '$$Tag', '$$Thing', '$timeout', '$uibModal', function($compile, $$Tag, $$Thing, $timeout, $uibModal){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            ready: '=?',
            dataset: '=?',
            trigger: '='
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/summary-trigger/summary-trigger.template.html',
        controller: function($scope, $$Tag, $$Thing, $timeout, $q){
            $scope.myTrigger = _.clone($scope.trigger);
            $scope.currentStep = 1;

            $scope.triggerWhenConditions = [
                {text: '条件为真', value: Trigger.WhenEnum.TRUE},
                {text: '条件由假转真', value: Trigger.WhenEnum.FALSE_TO_TRUE},
                {text: '条件改变', value: Trigger.WhenEnum.CHANGED}
            ];

            $scope.aggregationFunctions = [
                {text: '求和', value: TriggerSummarySource.FunctionEnum['SUM']},
                {text: '计数', value: TriggerSummarySource.FunctionEnum['COUNT']},
                {text: '最大值', value: TriggerSummarySource.FunctionEnum['MAX']},
                {text: '最小值', value: TriggerSummarySource.FunctionEnum['MIN']},
                {text:'平均值', value: TriggerSummarySource.FunctionEnum['AVG']}
            ];

            $scope.dataContainer =  {
                mySources: [],
                myTargets: [],
                summaryConditionClause: {}
            };

            $scope.summarySchema = [];

            $scope.schema = [
                {name: 'power', type:'boolean'},
                {name: 'dimming', type: 'range'}, 
                {name: 'color', type: 'in', values:['red', 'green', 'blue']}
            ];

            /**
             * [init description]
             * @return {[type]} [description]
             */
            $scope.init = function(){
                _.each($scope.myTrigger.summarySource, function(source){
                    $scope.dataContainer.mySources.push(source.source);
                });
            };

            $scope.previousStep = function(step){
                $scope.currentStep = step - 1;
            };

            $scope.nextStep = function(step){
                switch(step){
                    case 1: 
                        saveSource();
                        break;
                    case 2:
                        saveExpression();
                        break;
                    case 3: 
                        saveCondition();
                        break;
                    case 4:
                        saveTarget();
                        break;
                    case 5:
                        saveTriggerCommand();
                }
                $scope.currentStep = step + 1;
                console.log($scope.myTrigger);
            };

            $scope.createSource = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/components/TriggerManager/new-source.html',
                    controller: 'summaryTrigger.CreateSource',
                    size: 'md'
                });

                modalInstance.result.then(function (source) {
                    $scope.dataContainer.mySources.splice(0, 0, source);
                });
            };

            $scope.createTarget = function(){
                $scope.dataContainer.myTargets.splice(0, 0, {});
            };

            /**
             * step 1, save summary trigger's trigger source
             * @return {[type]} [description]
             */
            function saveSource (){
                var newSources = [];
                _.each($scope.dataContainer.mySources, function(source){
                    var newSource = new TriggerSummarySource();
                    var sourceObj = {};
                    if(source.thingList){
                        sourceObj.thingList = _.pluck(source.thingList, 'globalThingID');
                    }else{
                        sourceObj.tagList = _.pluck(source.tagList, 'displayName');
                        sourceObj.andExpress = source.andExpress;
                    }

                    newSource.setSource(sourceObj);
                    newSource.setName(source.name);
                    newSources.push(newSource);
                });

                _.each(newSources, function(source){
                    source.schema = [{name: 'power', type:'boolean'}, {name: 'dimming', type: 'value'}];
                    $scope.myTrigger.addSummarySource(source);
                });
            }

            /**
             * step 2, save summary trigger's trigger sources' expressions
             * @return {[type]} [description]
             */
            function saveExpression(){
                $scope.summarySchema = [];

                _.each($scope.myTrigger.summarySource, function(source, key){
                    var selectedFields = _.where(source.schema, {_checked: true});
                    source.expressList = [];
                    _.each(selectedFields, function(field){
                        if(!field.summaryAlias || field.summaryAlias == "") return; 
                        source.expressList.push({
                            stateName: field.name,
                            'function': _.clone(field['function']),
                            summaryAlias: field.summaryAlias
                        });
                        /**
                         * [saveCondition description]
                         * @
                         * @return {[type]}     [description]
                         */
                        $scope.summarySchema.push({
                            name: field.summaryAlias,
                            type: 'range'
                        });

                    });
                });
            }

            /**
             * step 3, save summary trigger's trigger condition
             * @return {[type]} [description]
             */
            function saveCondition(){
                $scope.myTrigger.setTriggersWhen($scope.myTrigger.predicate.triggersWhen.value);
                $scope.myTrigger.setCondition($scope.dataContainer.summaryConditionClause);
            }

            /**
             * step 4, save summary trigger's trigger target
             * @return {[type]} [description]
             */
            function saveTarget(){
                var newSources = [];
                _.each($scope.dataContainer.myTargets, function(source){
                    var newSource = new TriggerTarget();
                    var sourceObj = {};
                    if(source.thingList){
                        sourceObj.thingList = _.pluck(source.thingList, 'globalThingID');
                    }else{
                        sourceObj.tagList = _.pluck(source.tagList, 'displayName');
                        sourceObj.andExpress = source.andExpress;
                    }

                    newSource.setSource(sourceObj, source.sourceType, source.andExpress);
                    newSources.push(newSource);
                });

                _.each(newSources, function(source){
                    
                });
                $scope.myTrigger.setTargets(newSources);
            }

            /**
             * step 5, save summary trigger's command after the trigger is triggered.
             * @return {[type]} [description]
             */
            function saveTriggerCommand(){
                
            }

            
        }
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