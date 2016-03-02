/*
{
  "type" : "Group",
  "perdicate" : {
    "eventSource" : "states",
    "triggersWhen" : "CONDITION_TRUE",
    "condition" : {
      "clauses" : [ {
        "field" : "bar",
        "upperLimit" : 100,
        "upperIncluded" : false,
        "lowerIncluded" : false,
        "type" : "range"
      }, {
        "field" : "foo",
        "upperIncluded" : false,
        "lowerLimit" : 0,
        "lowerIncluded" : false,
        "type" : "range"
      } ],
      "type" : "or"
    }
  },
  "targets" : [ {
    "command" : {
      "actions" : [ {
        "powerOn" : {
          "power" : true
        }
      } ],
      "schemaVersion" : 0,
      "metadata" : { }
    }
  } ],
  "source" : {
    "thingList" : [ ],
    "tagList" : [ "Custom-name1", "Custom-name2", "Custom-name3" ],
    "andExpress" : false
  },
  "policy" : {
    "groupPolicy" : "Percent",
    "criticalNumber" : 75
  }
}
*/

'use strict';

angular.module('BeehivePortal')
  .directive('groupTrigger', ['$compile', '$$Tag', '$$Thing', '$timeout', '$uibModal', function($compile, $$Tag, $$Thing, $timeout, $uibModal){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            ready: '=?',
            dataset: '=?',
            trigger: '='
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/group-trigger/group-trigger.template.html',
        controller: function($scope, $$Tag, $$Thing, $timeout, $q, $http){
            $scope.myTrigger = _.clone($scope.trigger);
            $scope.currentStep = 1;

            $scope.triggerWhenConditions = [
                {text: '条件为真', value: Trigger.WhenEnum.TRUE},
                {text: '条件由假转真', value: Trigger.WhenEnum.FALSE_TO_TRUE},
                {text: '条件改变', value: Trigger.WhenEnum.CHANGED}
            ];

            $scope.dataContainer =  {
                mySource: {
                    thingList: _.clone($scope.trigger.source.thingList) || [],
                    tagList: _.clone($scope.trigger.source.tagList) || [],
                    andExpress: $scope.trigger.source.andExpress
                },
                myTargets: []
            };

            $scope.summarySchema = [];

            $scope.schema = [
                {name: 'power', type:'boolean'},
                {name: 'dimming', type: 'range'}, 
                {name: 'color', type: 'in', values:['red', 'green', 'blue']}
            ];

            $http({
                method: 'GET',
                url:'http://114.215.196.178:8080/demohelper/api/industrytemplate?thingType=demoThingType&name=demoName&version=demoVer'}
            ).then(function(response){
                $scope.schema = response.data;
                $scope.actions = $scope.schema.actions;
                
            });

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
                        saveCondition();
                        break;
                    case 3:
                        saveTarget();
                        break;
                    case 4:
                        saveTriggerCommand();
                }
                $scope.currentStep = step + 1;
                console.log($scope.myTrigger);
            };

            $scope.createTarget = function(){
                $scope.dataContainer.myTargets.splice(0, 0, new TriggerTarget());
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
             * step 2, save summary trigger's trigger condition
             * @return {[type]} [description]
             */
            function saveCondition(){
                $scope.myTrigger.setTriggersWhen($scope.myTrigger.predicate.triggersWhen.value);
                $scope.myTrigger.setCondition($scope.dataContainer.summaryConditionClause);
            }

            /**
             * step 3, save summary trigger's trigger target
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
             * step 4, save summary trigger's command after the trigger is triggered.
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