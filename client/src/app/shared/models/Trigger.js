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
  "summarySource" : {
    "a" : {
      "expressList" : [ {
        "stateName" : "foo",
        "function" : "Sum",
        "summaryAlias" : "sum_number"
      }, {
        "stateName" : "bar",
        "function" : "Avg",
        "summaryAlias" : "avg_number"
      } ],
      "source" : {
        "thingList" : [ ],
        "tagList" : [ "Custom-name0", "Custom-name1" ],
        "andExpress" : false
      }
    },
    "b" : {
      "expressList" : [ {
        "stateName" : "foo",
        "function" : "Sum",
        "summaryAlias" : "sum_num"
      }, {
        "stateName" : "bar",
        "function" : "Avg",
        "summaryAlias" : "avg_num"
      } ],
      "source" : {
        "thingList" : [ ],
        "tagList" : [ "Custom-name2", "Custom-name3" ],
        "andExpress" : false
      }
    }
  }
}
*/


(function(){
    var Trigger = function(type){
        
        var structure = {
            'name': '',
            "type" : type,
            "predicate" : {
                "eventSource" : "states",
                "triggersWhen" : '',
                "condition" : {}
            },
            'source': {},
            "targets" : [],
            "summarySource" : {}
        };

        _.extend(this, structure);
    };

    /**
     * if type is simple, then source is a single thing
     * else source is either a thing array or tag array
     * @param {[type]} sourceObj [description]
     */
    Trigger.prototype.setSource = function(sourceObj, type){
        if(this.type == Trigger.TypeEnum.SIMPLE){
            this.source = {
                thingID: sourceObj
            };
        }else{
            if(type == 'thing'){
                this.source = {
                    thingList: sourceObj
                };
            }else{
                this.source = {
                    tagList: sourceObj
                };
            }
        }
    };

    Trigger.prototype.setName = function(name){
        this.name = name;
    }

    /**
     * from triggerwhen enum
     * @param {[type]} triggerWhen [description]
     */
    Trigger.prototype.setTriggersWhen = function(triggerWhen){
        this.predicate.triggersWhen = triggerWhen;
    };

    /**
     * from typeEnum
     * @param {[type]} type [description]
     */
    Trigger.prototype.setTriggerType = function(type) {
        this.type = type;
    };


    Trigger.prototype.setTargets = function(targets){
        this.targets = targets;
    };

    /**
     * [add a target into this trigger.]
     * @param {TriggerTarget} target [an instance of TriggerTarget]
     */
    Trigger.prototype.addTarget = function(target){
        this.targets.push(target);
    };

    /**
     * remove a target from this trigger
     * @param  {TriggerTarget} target
     */
    Trigger.prototype.removeTarget = function(target){
        this.targets.remove(target);
    };

    /**
     * trigger condition
     * @param {[json]} condition [user defined json. according to given structure]
     */
    Trigger.prototype.setCondition = function(condition){
        this.predicate.condition = condition;
    };

    Trigger.WhenEnum = {
        'TRUE': 'CONDITION_TRUE',
        'FALSE_TO_TRUE': 'CONDITION_FALSE_TO_TRUE',
        'CHANGED': 'CONDITION_CHANGED'
    };

    Trigger.TypeEnum = {
        'SIMPLE': 'Simple',
        'GROUP': 'Group',
        'SUMMARY': 'Summary'
    };

    Trigger.prototype.addSummarySource = function(summarySource){
        this.summarySource[summarySource.name] = summarySource;
    };
    /*
    
    "thingList":[],
    "tagList": [],
    "andExpress": false,
    "command": {
        "actions": [{
            "powerOn" : {
                "power" : true
            }
        }],
        "schemaVersion" : 0,
        "metadata" : { }
    }
    */

    function TriggerTarget(type){
        _.extend(this, {
            'thingList': null,
            'tagList': null,
            "command" : {
                "actions" : [{
                    "powerOn" : {
                        "power" : true
                    }
                }],
                "schemaVersion" : 0,
                "metadata" : {}
            }
        });
        if(type == 'thing'){
            this.thingList = [];
        }else{
            this.tagList = [];
        }
    }

    TriggerTarget.prototype.addAction = function(action){
        this.command.actions.push(action);
    };

    TriggerTarget.prototype.setSchemaVersion = function(version){
        this.command.schemaVersion = version;
    };

    TriggerTarget.prototype.setMetaData = function(metaData){
        this.command.metadata = metaData;
    };

    TriggerTarget.prototype.setSource = function(sourceObj, type, andExpress){
        if(type == 'thing'){
            this.thingList = sourceObj.thingList;
        }else{
            this.tagList = sourceObj.tagList;
            this.andExpress = andExpress;
        }
    }

    /*
    "a": {
        "expressList" : [ {
            "stateName" : "foo",
            "function" : "Sum",
            "summaryAlias" : "sum_number"
        }, {
            "stateName" : "bar",
            "function" : "Avg",
            "summaryAlias" : "avg_number"
        }],
        "source" : {
            "thingList" : [ ],
            "tagList" : [ "Custom-name0", "Custom-name1" ],
            "andExpress" : false
        }
    }
    */
    function TriggerSummarySource(){
        this.name = '';
        this.expressList = [];
        this.source = {};
    }

    TriggerSummarySource.prototype.setSource = function(sourceObj){
        this.source = sourceObj;
    };

    TriggerSummarySource.prototype.setName = function(name){
        this.name = name;
    };
    /**
     * add an expression to summary source, structure:
     *  {
            "stateName" : "bar",
            "function" : "Avg",
            "summaryAlias" : "avg_number"
        }
     * @param {[type]} stateName    [description]
     * @param {[type]} func         [description]
     * @param {[type]} summaryAlias [description]
     */
    TriggerSummarySource.prototype.addExpression = function(stateName, func, summaryAlias){
        this.expressList.pus({
            stateName: stateName,
            'function': func,
            summaryAlias: summaryAlias
        });
    };

    TriggerSummarySource.FunctionEnum = {
        'SUM': 'Sum',
        'COUNT': 'Count',
        'MAX': 'Max',
        'MIN': 'Min',
        'AVG': 'Avg'
    };

    window.TriggerTarget = TriggerTarget;
    window.TriggerSummarySource = TriggerSummarySource;
    window.Trigger = Trigger;
})();