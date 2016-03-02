'use strict';

angular.module('BeehivePortal')
  .controller('ThingManagerController', ['$scope', '$rootScope', '$state', 'AppUtils', '$uibModal',function($scope, $rootScope, $state, AppUtils, $uibModal) {
    
    
    /*
     * create remote control modal
     */
    $scope.openRemoteControl = function(thing){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/ThingManager/RemoteControl.template.html',
            controller: 'ThingManagerController.RemoteControl',
            size: 'md',
            resolve: {
              thing: function () {
                return thing;
              }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log(thing);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    /*
     * create edit rule control modal
     */
    
    $scope.openEditRuleModal = function(thing){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/ThingManager/ThingRule.template.html',
            controller: 'ThingManagerController.EditRule',
            size: 'lg',
            resolve: {
              thing: function () {
                return thing;
              }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log(thing);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    
    /*
     * context menu setting
     */
    $scope.myMenu = {
        itemList:[
            {
                text: '查看详情',
                callback: function(thing){
                    $scope.navigateTo($scope.navMapping.THING_DETAIL, {thingid: thing.globalThingID});
                }
            },
            {
                text:'编辑',
                callback: function (thing) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/components/portal/ThingManager/EditThing.template.html',
                        controller: 'ThingManagerController.EditThing',
                        size: 'md',
                        resolve: {
                          thing: function () {
                            return thing;
                          }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        _.extend(thing, selectedItem);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                }
            },
            {
                text:'删除',
                callback: function (thing) {
                    console.log('Delete thing');
                    console.log(thing);
                }
            }
        ],
        setting:{

        }
    };

  }])

  /*
   * remote control modal controller
   */
  .controller('ThingManagerController.RemoteControl',function ($scope, $uibModalInstance, thing, $timeout) {
    $scope.thing = thing;
    $scope.status = {};
    $scope.ok = function () {
        $uibModalInstance.close($scope.thing);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $uibModalInstance.opened.then(function(){
        $timeout(function(){
            $scope.slider1 = {
                value: 150,
                options: {
                    floor: 0,
                    ceil: 450
                }
            };
            $scope.slider2 = {
                value: 20,
                options: {
                    floor: 16,
                    ceil: 30
                }
            };

        });
    });
    
  })

  /*
   * edit thing modal controller
   */
  .controller('ThingManagerController.EditThing',function ($scope, $uibModalInstance, thing, $$Thing, $$Tag) {
    $scope.thing = thing;
    _.each($scope.thing.tags,function(tag, index){
        var tmp = tag.split('-');
        tmp.splice(0,1);
        $scope.thing.tags[index] = tmp.join('-');
    });
    var origionTags = _.clone($scope.thing.tags);

    $scope.ok = function () {
        $scope.saveTags();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $$Tag.queryAll(function(tags){
        $scope.queriedTags = _.where(tags, {tagType: 'Custom'});
        console.log(tags);
    },function(response){
        console.log(response);
    });

    /*
     * remove tag
     */
    $scope.removeTag = function(tagName){
        $scope.thing.tags = _.reject($scope.thing.tags, function(tag){
            return tag == tagName;
        });
    }

    $scope.saveTags = function(){
        var selectedTags = _.pluck(_.where($scope.queriedTags ,{_checked: true}), 'tagName'),
            myTags = thing.tags,
            newTags = selectedTags.concat(myTags);

        $$Thing.bindTags({things:$scope.thing.globalThingID, tags: newTags.join(',')}, function(){
                
            /*
             * get ids of things abondoned
             */
            var idsToDelete = _.difference(origionTags, newTags);

            /*
             * delete old thing id
             */
            _.each(idsToDelete, function(id) {
                $$Thing.removeTag({globalThingID:$scope.thing.globalThingID, tagName: id});
            });
            
            $uibModalInstance.close($scope.thing);    
        });
    }
  })

  /*
   * edit rule modal controller
   */
  .controller('ThingManagerController.EditRule', function ($scope, $uibModalInstance, thing) {

    /*
     * init 
     */
    
    $scope.selectedRule = {}; // rule selected for adding
    $scope.newRule = {};
    $scope.ruleValueType = {
        RANGE_VALUE:{ 
            name: 'RANGE_VALUE',
            predicators: [
                {
                    name:'>=', 
                    id: 1
                },
                {
                    name:'<=',
                    id: 2
                },
                {
                    name: '==',
                    id: 3
                },
                {
                    name: '!=',
                    id: 4
                }
            ]
        },
        OPTIONS: {
            name: 'OPTIONS',
            predicators: [
                {
                    name:'==',
                    id: 3
                }, 
                {
                    name: '!=',
                    id: 4
                }
            ],
            values: [
                {
                    name: 'ON',
                    value : true,
                }, 
                {
                    name: 'OFF',
                    value: false
                }
            ]
        }
    };

    $scope.dataForTheTree1 =
    [
        { "name" : "Joe", "age" : "21", "children" : [
            { "name" : "Smith", "age" : "42", "children" : [] },
            { "name" : "Gary", "age" : "21", "children" : [
                { "name" : "Jenifer", "age" : "23", "children" : [
                    { "name" : "Dani", "age" : "32", "children" : [] },
                    { "name" : "Max", "age" : "34", "children" : [] }
                ]}
            ]}
        ]},
        { "name" : "Albert", "age" : "33", "children" : [] },
        { "name" : "Ron", "age" : "29", "children" : [] }
    ];

    $scope.ruleList = [
        {
            "name": "开关",
            "id": 101,
            "rules": [">=","==","<=", "!="],
            "options": ["ON", "OFF"], 
            "type": $scope.ruleValueType.OPTIONS
        },
        {
            "name": "亮度",
            "id": 101,
            "rules": [">=","==","<=", "!="],
            "range": {"min": 0, "max": 100},
            "type": $scope.ruleValueType.RANGE_VALUE
        }
    ];

    $scope.rules = {
        join: "OR",
        children:[
            {
                myRule: $scope.ruleList[1],
                predicator: ">=",
                value: 100
            },
            {
                myRule: $scope.ruleList[1],
                predicator: ">=",
                value: 300
            }
        ]
    };
    $scope.thing = thing;

   
    
    $scope.rules.children[0].parent = $scope.rules;
    $scope.rules.children[1].parent = $scope.rules;

    /*
     * end of int
     */
    
    $scope.selectedRuleChange = function(option){
        $scope.selectedRule = option;
        console.log($scope.selectedRule);
        $scope.newRule = {
            myRule: $scope.selectedRule,
            predicator: $scope.selectedRule.type.predicators[0],
            value: ''
        };
    };

    $scope.selectedValueChange = function(option){
        $scope.newRule.value = option;
    }

    $scope.addRule = function(){
        var clause = $scope.selectedClause;
        var newRule = {
            myRule: $scope.ruleList[0],
            predicator: "==",
            value: "ON"
        };

        var clauseClone = _.clone(clause);
        
        delete clause.myRule;
        delete clause.predicator;
        delete clause.value;
        delete clause.children;

        clause.join = "AND";
        clause.children = [clauseClone,newRule];
        clauseClone.parent = clause;
        newRule.parent = clause;
    };

    $scope.orRule = function(){
        var clause = $scope.selectedClause;
        var newRule = {
            myRule: $scope.ruleList[0],
            predicator: "==",
            value: "ON"
        };

        var clauseClone = _.clone(clause);
        
        delete clause.myRule;
        delete clause.predicator;
        delete clause.value;
        delete clause.children;

        clause.join = "OR";
        clause.children = [clauseClone,newRule];
        clause.parent = clause;
    };

    $scope.cleanRule = function(){
        retrievie($scope.rules,function(clause){
            simplifyClause(clause);
            joinClauses(clause);
        });
    };

    $scope.deleteClause = function(clause){
        clause.parent.children.remove(clause);
        simplifyClause($scope.rules);
    };

    $scope.selectClause = function(clause){
        $scope.selectedClause = clause;
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.thing);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    function retrievie(clause, callback){
        _.each(clause.children,function(clause){
            retrievie(clause,callback);
        })
        callback(clause);
    }

    /*
     * simplify clause with only one sub clause,
     * the clause is useless in this case.
     */
    function simplifyClause(clause){
        if(clause.children){
            _.each(clause.children,function(subClause){
                if(subClause.children && subClause.children.length == 1){
                    clause.children.remove(subClause);
                    clause.children.push(subClause.children[0]);
                    subClause.children[0].parent = clause;
                }
            })
        }
    }

    /*
     * join clauses that have same predicator
     */
    function joinClauses(clause){
        if(clause.children){
            _.each(clause.children, function(subClause){
                if(subClause.join == clause.join){
                    _.each(subClause.children, function(childClause){
                        childClause.parent = clause;
                    });
                    clause.children = clause.children.concat(subClause.children);
                    clause.children.remove(subClause);
                }
            });
        }
    }
  });


