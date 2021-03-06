(function(){
    var Trigger = function(type){
        
        var structure = {
            'triggerName': '',
            "type" : type,
            "predicate" : {
                "eventSource" : "states",
                "triggersWhen" : Trigger.WhenEnum.CONDITION_TRUE,
                "condition" : {}
            },
            'source': {},
            "targets" : [],
            "summarySource" : {},
            "recordStatus": "disable"
        };

        _.extend(this, structure);

        if(type == Trigger.TypeEnum.SUMMARY){
            delete this.source;
        }else{
            delete this.summarySource;
        }
    };

    Trigger.PolicyTypeEnum = {
        ANY: 'Any',
        ALL: 'All',
        SOME: 'Some',
        PERCENT: 'Percent'
    };

    Trigger.prototype.init = function(data){
        _.extend(this, data);
        if(!this.triggerName){
            this.setName('未命名');
        }
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
                    thingList: sourceObj.thingList
                };
            }else{
                this.source = {
                    tagList: sourceObj.tagList,
                    type: sourceObj.type,
                    andExpress: sourceObj.andExpress
                };
            }
        }
    };

    Trigger.prototype.disable = function(){
        this.recordStatus = 'disable';
    }

    Trigger.prototype.enable = function(){
        this.recordStatus = 'enable';
    };

    Trigger.prototype.setSchedule = function(schedule){
        this.predicate.schedule = schedule;
    };

    Trigger.prototype.setName = function(name){
        this.triggerName = name;
    }

    Trigger.prototype.setPolicy = function(policy){
        this.policy = policy;
    };

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
        'CONDITION_TRUE': 'CONDITION_TRUE',
        'CONDITION_FALSE_TO_TRUE': 'CONDITION_FALSE_TO_TRUE',
        'CONDITION_CHANGED': 'CONDITION_CHANGED'
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
                "schema": 'test',
                "actions" : [],
                "schemaVersion" : 0,
                "metadata" : {}
            }
        });
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

        _.each(this, function(val, key){
            delete this[key];
        });

        if(type == 'thing'){
            this.thingList = sourceObj.thingList;
        }else{

            this.tagList = sourceObj.tagList;
            this.andExpress = andExpress;
            this.type = sourceObj.type;
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