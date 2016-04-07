'use strict';

angular.module('BeehivePortal')
  .factory('TriggerService',['$rootScope', '$$Type', '$q' , '$$Thing', function($rootScope, $$Type, $q, $$Thing) {
    var TriggerService = {};

    TriggerService.triggerWhenConditions = [
        {text: '条件为真', value: Trigger.WhenEnum.CONDITION_TRUE},
        {text: '条件由假转真', value: Trigger.WhenEnum.CONDITION_FALSE_TO_TRUE},
        {text: '添加由真转假', value: Trigger.WhenEnum.CONDITION_CHANGED},
        {text: '条件改变', value: Trigger.WhenEnum.CONDITION_CHANGED}
    ];

    TriggerService._ScheduleTriggerFields = ['predicate', 'triggerName', 'targets', 'type'];
    TriggerService._SimpleTriggerFields = ['source', 'predicate', 'triggerName', 'targets', 'type'];
    TriggerService._GroupTriggerFields = ['source', 'predicate', 'triggerName', 'targets', 'type'];
    TriggerService._SummaryTriggerFields = ['source', 'predicate', 'triggerName', 'targets', 'type'];


    TriggerService.getDataForRequest = function(trigger, type){
        var data = _.clone(trigger),
            fields = null;

        switch(type){
            case 'Schedule':
                fields = TriggerService._ScheduleTriggerFields;
                break;
            case 'Simple':
                fields = TriggerService._SimpleTriggerFields;
                break;
            case 'Group':
                fields = TriggerService._GroupTriggerFields;
                break;
            case 'Summary':
                fields = TriggerService._SummaryTriggerFields;
                break;
        }

        _.each(data, function(value, field){
            if(fields.indexOf(field) == -1){
                delete data[field];
            }
        });
        return data;
    };

    TriggerService.getSourceTypes = function(source){
        return new Promise(function(resolve, reject){

            if(source.thingList && source.thingList.length > 0){
                var types = source.thingTypes;
                if(!types){
                    var requests = [];
                    _.each(source.thingList, function(globalThingID){
                        var promise = $$Thing.get({globalThingID: globalThingID}).$promise;
                        requests.push(promise);
                    });

                    $q.all(requests).then(function(things){
                        types = _.uniq(_.pluck(things, 'type'));
                        resolve(types);
                    });
                    
                    return;
                }
                resolve(types);
                return;
            }

            if(source.tagList){
                if(source.selectedType && source.selectedType.id){
                    resolve([source.selectedType.id]);
                    return;
                }

                if(source.type){
                    resolve([source.type]);
                    return;
                }

                $$Type.byTags({tags: source.tagList}, function(types){
                    resolve(types);
                });
                return;
            };
            
            resolve([]);
        });
    }


    TriggerService.getTypeSchemas = function(types){
        var queries = [];
        _.each(types, function(type){
            queries.push(TriggerService.getSchemaByType(type).$promise);
        });
        return $q.all(queries);
    }

    TriggerService.getSchemaProperties = function(schema){
        var result = [];
        _.each(schema.statesSchema.properties, function(value, key){
            result.push(_.extend({name: key}, value));
        });
        return result;
    };

    TriggerService.getSchemaActions = function(schema){
        return schema.actions;        
    };

    TriggerService.initSchema = function(schema){
        /*
        schema.statesSchema.properties.schedule = {
            type: 'schedule'
        };
        */
    };

    TriggerService.getSchemaByType = function(type){
        var schema = {};
        var myResolve,
            myReject;


        schema.$promise = new Promise(function(resolve, reject){
            myResolve = resolve;
            myReject = reject;
        });

        $$Type.getSchema({type: type}, function(mySchema){
            _.extend(schema, mySchema);
            TriggerService.initSchema(schema);
            myResolve(schema);
        }, myReject);

        return schema;
    };

    TriggerService.xSchemas = function(schemas){
        if(schemas.length == 1){
            return schemas[0];
        }

        var schemaResult = schemas[0];

        _.each(schemas, function(schema){
            //schemaResult = TriggerService.xSchema(schemaResult, schema);
        });
        
        return schemaResult;
    };

    TriggerService.initTargetSchema = function(target, schema){
        _.each(target.command.actions, function(action){
            _.each(action, function(actionContent, actionName){
                if(!schema.actions[actionName]) return;
                schema.actions[actionName]._checked = true;
                _.each(actionContent, function(propertyValue, propertyName){
                    schema.actions[actionName].in.properties[propertyName].value = propertyValue;
                    schema.actions[actionName].in.properties[propertyName]._checked = true;
                });
            });
        });
    };

    TriggerService.revertCron = function(cron){
        cron = cron.substr(2);
        cron = cron.substr(0, cron.length - 1) + '*';
        return cron;
    };

    TriggerService.getRightCron = function(cron){
        cron = '0 ' + cron;
        return cron.substr(0, cron.lastIndexOf('*')) + '?';
    };

    TriggerService.xSchema = function(schema1, schema2){
        var schema = {statesSchema:{}, actions:[]},
            properties1 = schema1.statesSchema.properties,
            properties2 = schema2.statesSchema.properties,
            properties = {},

            actions1 = schema1.actions,
            actions2 = schema2.actions,
            actions = {};

        _.each(properties1, function(property1, key1){
            var property = properties2[key1];
            if(property && property.type == property1.type)
                properties[key1] = property;
        });

        _.each(actions1, function(action1, name){
            if(actions2[name]){
                var action2 = actions2[name];
                var flag = true;
                _.each(action1.in.properties, function(value, key){
                    if(!action2.in.properties[key] || !action2.in.properties[key].type == value.type){
                        flag = false;
                    }
                });
                if(flag){
                    actions[name] = action1;
                }
            }
        });

        schema.statesSchema.properties = properties;
        schema.actions = actions;

        return schema;
    };

    return TriggerService;
  }
]);