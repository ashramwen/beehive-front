'use strict';

angular.module('BeehivePortal')
  .factory('TriggerDetailService',['$rootScope', '$$Type', '$q' , '$$Thing', '$$Location', '$translate', function($rootScope, $$Type, $q, $$Thing, $$Location, $translate) {
    var TriggerDetailService = {};
    TriggerDetailService.targetTrigger = null;
    TriggerDetailService.targetCondtion = null;
    TriggerDetailService.targetAction = null;

    TriggerDetailService.TriggerTypes = {
      CONDTION: 'CONDTION',
      SCHEDULE: 'SCHEDULE'
    };

    TriggerDetailService.States = {
      NEW_CONDITION_TRIGGER_CONDITION: 'app.portal.TriggerManager.NewTrigger.ConditionTriggerConditionHandler',
      CONDITION_TRIGGER_CONDITION: 'app.portal.TriggerManager.TriggerDetail.ConditionTriggerConditionHandler',
      NEW_CONDITION_TRIGGER_ACTION: 'app.portal.TriggerManager.NewTrigger.ConditionTriggerActionHandler',
      CONDITION_TRIGGER_ACTION: 'app.portal.TriggerManager.TriggerDetail.ConditionTriggerActionHandler',
      
      NEW_ML_TRIGGER_CONDITION: 'app.portal.TriggerManager.NewTrigger.MachineLearningTriggerConditionHandler',
      ML_TRIGGER_CONDITION: 'app.portal.TriggerManager.TriggerDetail.MachineLearningTriggerConditionHandler',
      NEW_ML_TRIGGER_ACTION: 'app.portal.TriggerManager.NewTrigger.MachineLearningTriggerActionHandler',
      ML_TRIGGER_ACTION: 'app.portal.TriggerManager.TriggerDetail.MachineLearningTriggerActionHandler',
      
      
      NEW_SCHEDULE_TRIGGER_ACTION: 'app.portal.TriggerManager.NewTrigger.ScheduleTriggerActionHandler',
      SCHEDULE_TRIGGER_ACTION: 'app.portal.TriggerManager.TriggerDetail.ScheduleTriggerActionHandler',

      NEW_SCHEDULE_TRIGGER: 'app.portal.TriggerManager.NewTrigger.ScheduleTrigger',
      SCHEDULE_TRIGGER: 'app.portal.TriggerManager.TriggerDetail.ScheduleTrigger',
      NEW_CONDITION_TRIGGER: 'app.portal.TriggerManager.NewTrigger.ConditionTrigger',
      CONDITION_TRIGGER: 'app.portal.TriggerManager.TriggerDetail.ConditionTrigger',
      NEW_ML_TRIGGER: 'app.portal.TriggerManager.NewTrigger.MachineLearningTrigger',
      ML_TRIGGER: 'app.portal.TriggerManager.TriggerDetail.MachineLearningTrigger',

      NEW_TRIGGER_ROOT: 'app.portal.TriggerManager.NewTrigger',
      TRIGGER_LIST: 'app.portal.TriggerManager.TriggerList'
    };

    TriggerDetailService.getExpressionDisplay = {
      'eq': '＝',
      'gt': '＞',
      'gte': '≥',
      'lt': '＜',
      'lte': '≤'
    };

    TriggerDetailService.timeUnits = [
      {text: '小时', value: 'Hour'},
      {text: '分钟', value: 'Minute'}
    ];

    TriggerDetailService.CronTypes = {
      'DAILY': '? * *',
      'WEEKDAY': '? * 2-6',
      'WEEKEND': '? * 1,7'
    };

    TriggerDetailService.ScheduleTypes = {
      'CRON': 'Cron',
      'INTERVAL': 'Interval'
    };

    TriggerDetailService.parseSchema = function(schema){
      if(!schema || !schema.content) return {};
      return {
        name: schema.name,
        displayName: schema.content.statesSchema.title || schema.thingType,
        version: schema.version,
        properties: TriggerDetailService.parseProperties(schema.content.statesSchema.properties),
        actions: TriggerDetailService.parseActions(schema.content.actions)
      };
    };

    TriggerDetailService.parseActions = function(actions){
      return _.map(actions, function(action, actionName){
        return {
          actionName: actionName,
          displayName: action.displayNameCN || actionName,
          properties: TriggerDetailService.parseProperties(action.in.properties)
        }
      });
    };

    TriggerDetailService.parseProperties = function(properties){
      return _.map(properties, function(property, propertyName){
        var _property = TriggerDetailService.parseProperty(property);
        _.extend(_property, {
          propertyName: propertyName,
          displayName: property.displayNameCN || propertyName
        });
        return _property;
      });
    };

    TriggerDetailService.parseProperty = function(property){
      var _property = AppUtils.clone(property);

      if(!_property.enumType){
        generateTooltip(_property);
        return _property;
      } 

      _property.options = [];
      _property.enum = _property.enum || [];
      switch(_property.enumType){
        case 'BOOLEAN':
          if(!_property.enum){
            if(_property.type == 'boolean'){
              _property.enum = {
                '是': true,
                '否': false
              };
            }else{
              var minimum = _property.minimum;

              _property.enum = {
                '是': minimum + 1,
                '否': minimum
              };
            }
            
          }
        case 'NUMBER':
        default:
          var values = [];
          if(_property.type == 'boolean'){
            values = _.map(_property.enum, function(value, key){
              return value;
            });
          }else{
            for(var i = _property.minimum; i <= _property.maximum; i++){
              values.push(i);
            }
          }
          _property.options = new Array(values.length);

          _.each(_property.enum, function(value, key){
            var index = values.indexOf(value);
            if(index > -1){
              _property.options[index] = {text: key, value: value};
            }
          });
          break;
      }

      function generateTooltip(property){
        var tooltipContent = [];

        if(property.hasOwnProperty('minimum')){
          tooltipContent.push('最小值：' + property.minimum);
        }
        if(property.hasOwnProperty('maximum')){
          tooltipContent.push('最大值：' + property.maximum);
        }
        if(tooltipContent.length){
          property.tooltip = tooltipContent.join(', ');
        }
      }

      return _property;
    };

    TriggerDetailService.parseTriggerActions = function(trigger){
      var promiseList = [];

      _.each(trigger.targets, function(target){
        var $defer = $q.defer();
        promiseList.push($defer.promise);

        var type = target.command.metadata.type;
        var things = _.map(target.thingList, function(globalThingID){
          return {
            globalThingID: globalThingID,
            typeDisplayName: '',
            type: type,
            location: '',
            locationDisplayName: ''
          };
        });

        var $thingsPromise = TriggerDetailService.getThingsDetail(things);

        var actions = _.map(target.command.actions, function(action){
          var actionName = Object.keys(action)[0];
          if(!actionName) throw new Error('action格式不正确');

          return {
            actionName: actionName,
            properties: _.map(action[actionName], function(propertyValue, key){
              return {
                propertyName: key,
                value: propertyValue
              };
            })
          };
        });

        var resultMap = {
          type: type,
          things: things,
          actions: actions
        };

        var $typeDefer = $q.defer();
        var $typePromise = $typeDefer.promise;

        $$Type.getSchema({type: type}, function(schema){
          var _schema = TriggerDetailService.parseSchema(schema);
          if(!_schema) throw new Error('生成种类' + type + '的schema时发生错误，请查询相关的行业模板。');

          _.each(actions, function(action){
            var _action = _.find(_schema.actions, {actionName: action.actionName});
            if(!_action) throw new Error('在schema:' + _schema.name + '中，没有查找到:action-' + action.actionName);
            _.extend(action, {displayName: _action.displayName});
            _.each(action.properties, function(property){
              var _property = _.find(_action.properties, {propertyName: property.propertyName});
              if(!_property) throw new Error('在schema:' + _schema.name + '中，的action: ' + action.actionName + '中，没有查找到:property-' + property.propertyName);
              property.displayName = _property.displayName;
              property.valueDisplayName = property.value;
              if(property.enumType){
                property.valueDisplayName = _property.options[property.value] || property.value;
              }
            });
          });

          _.each(things, function(thing){
            thing.typeDisplayName = _schema.displayName;
          });
          resultMap.typeDisplayName = _schema.displayName;
          $typeDefer.resolve();
        });

        $q.all([$typePromise, $thingsPromise]).then(function(){
          $defer.resolve(resultMap);
        });
      });

      return $q.all(promiseList);
    };

    TriggerDetailService.parseTriggerConditions = function(trigger){

      var promiseList = [];
      if(trigger.predicate.condition && trigger.predicate.condition.clauses 
          && trigger.predicate.condition.clauses.length){
        trigger.predicate.condition.clauses.pop();
        _.each(trigger.predicate.condition.clauses, function(clause){
          clause.clauses.pop();
        });
      }
      
      var groups = _.groupBy(trigger.summarySource, function(source, key){
        return key.substr(0, key.lastIndexOf('#'));
      });
      var groupIDs = _.groupBy(_.keys(groups), function(r){
        return r.substr(0, r.indexOf('#'));
      });

      var typeGroups = _.groupBy(groups, function(group, key){
        return key.substr(0, key.lastIndexOf('#'));
      });

      _.each(typeGroups, function(typeGroup, type){
        _.each(typeGroup, function(typeSource, index){
          var thingIDs = [];
          var expressList = [];
          _.each(typeSource, function(s){
            expressList = s.expressList;
            thingIDs = thingIDs.concat(s.source.thingList);
          });

          var $defer = $q.defer();
          promiseList.push($defer.promise);

          var thingPromiseList = [];
          var things = _.map(thingIDs, function(globalThingID){
            return {
              globalThingID: globalThingID,
              typeDisplayName: '',
              type: type,
              location: '',
              locationDisplayName: ''
            };
          });

          var $thingsPromise = TriggerDetailService.getThingsDetail(things);
          var propertyNames = _.pluck(expressList, 'stateName');

          var properties = _.map(propertyNames, function(propertyName){
            var clauses = [];
            _.each(trigger.predicate.condition.clauses, function(clause){
              clauses = clauses.concat(clause.clauses);
            });

            var propertyExp = _.find(clauses, {field: [groupIDs[type][index], thingIDs[0]].join('#') + '.' + propertyName});
            if(!propertyExp) throw new Error('Type '+ type + '中,' + propertyName + '属性的表达式不正确。');
            var expression = '';
            var value = null;
            if(!propertyExp) return;
            if(propertyExp.type == 'range'){
              if(propertyExp.hasOwnProperty('upperLimit')){
                if(propertyExp.upperIncluded){
                  expression = 'lte'
                }else{
                  expression = 'lt';
                }
                value = propertyExp.upperLimit;
              }
              if(propertyExp.hasOwnProperty('lowerLimit')){
                if(propertyExp.lowerIncluded){
                  expression = 'gte';
                }else{
                  expression = 'gt';
                }
                value = propertyExp.lowerLimit;
              }
            }else{
              expression = 'eq';
              value = propertyExp.value;
            }

            return {
              propertyName: propertyName,
              expression: expression,
              expressionDisplay: TriggerDetailService.getExpressionDisplay[expression],
              value: value
            };
          });

          var groupID = groupIDs[type][index];
          groupID = groupID.substr(groupID.indexOf('#') + 1);

          var resultMap = {
            id: groupID,
            properties: properties,
            type: type,
            things: things
          };

          var $typeDefer = $q.defer();
          var $typePromise = $typeDefer.promise;

          $$Type.getSchema({type: type}, function(schema){
            var _schema = TriggerDetailService.parseSchema(schema);
            if(!_schema) throw new Error('生成种类' + type + '的schema时发生错误，请查询相关的行业模板。');

            _.each(properties, function(property){
              var _property = _.find(_schema.properties, {propertyName: property.propertyName});
              if(!_property) throw new Error('在schema:' + _schema.name + '中，没有查找到:property-' + property.propertyName);
              
              _.extend(property, _property);
            });

            _.each(things, function(thing){
              thing.typeDisplayName = _schema.displayName;
            });
            resultMap.typeDisplayName = _schema.displayName;
            $typeDefer.resolve();
          });

          $q.all([$typePromise, $thingsPromise]).then(function(){
            $defer.resolve(resultMap);
          });
        });
      });

      return $q.all(promiseList);
    };

    TriggerDetailService.getThingsDetail = function(things){
      var $defer = $q.defer();
      
      $q.all([
          $translate('location.buildingBref'),
          $translate('location.floorBref'),
          $translate('location.partitionBref'),
          $translate('location.areaBref')
      ]).then(function(values){
        var locationsSuffix = values;
        $$Thing.getThingsByIDs({}, _.pluck(things, 'globalThingID'), function(thingsWithLocation){
          var locationPromiseList = [];

          _.each(things, function(thing){
            var _thing = _.find(thingsWithLocation, {id: thing.globalThingID});
            if(!_thing) throw new Error('没有查找的到thing:' + thing.globalThingID + '的详细信息。');

            if(!_thing.locations) return;
            _.extend(thing, _thing);
            thing.location = _thing.locations[0];
            locationPromiseList.push(TriggerDetailService.getLocationTree(thing.location));
            $$Type.getSchema({type: _thing.type}, function(schema){
              var _schema = TriggerDetailService.parseSchema(schema);
              thing.typeDisplayName = _schema.displayName;
            }); 
          });

          var thingsHasLocation = _.filter(things, function(thing){
            return thing.location;
          });

          $q.all(locationPromiseList).then(function(locationGroups){
            _.each(thingsHasLocation, function(thing, i){
              var parent = '';
              locationGroups[0].push({displayName: thing.location, location: thing.location});

              thing.locationDisplayName = _.map(locationGroups[i], function(location, i){
                var displayName = location.displayName.substr(parent.length) + locationsSuffix[i];
                parent = location.displayName;
                return displayName;
              }).join(' ');
            });
            $defer.resolve(things);
          });

        });
      });

      return $defer.promise;
    };

    
    TriggerDetailService.getLocationTree = function(locationID){
      var $defer = $q.defer();

      $$Location.getParent({location: locationID}, function(locations){

        var orderedLocations = getOrderedLocations(locations);

        $defer.resolve(orderedLocations);

        function getOrderedLocations(locationArr){
          return locationArr;
        }
      });

      return $defer.promise;
    }

    TriggerDetailService.parseSchedule = function(trigger){
      var scheduleObj = trigger.predicate.schedule;
      if(!scheduleObj) return {
        type: 'Cron'
      };
      var type = scheduleObj.type;

      var result = {
        type: type
      };

      if(type == TriggerDetailService.ScheduleTypes.CRON){
        var cronArr = scheduleObj.cron.split(' ');

        _.extend(result, {
          cron: scheduleObj.cron,
          hour: parseInt(cronArr[2]) || null,
          minute: parseInt(cronArr[1]),
        });

        if(result.hour == null){
          result.onceType = 'hourly';
        }else{
          result.onceType = 'exact';
          var d = new Date();
          d.setHours(result.hour);
          d.setMinutes(result.minute);
          d.setSeconds(0);
          d.setMilliseconds(0);
          result.time = d;
        }

      }else{
        _.extend(result, {
          timeUnit: scheduleObj.timeUnit, //'Day|Minute|Hour|Second'
          interval: scheduleObj.interval 
        });
      }

      return result;
    }

    TriggerDetailService.parseTimeSpan = function(trigger){
      if(!trigger.prepareCondition) return null;
      if(trigger.prepareCondition.type == 'cron'){
        var startCron = trigger.prepareCondition.startCron.split(' ');
        var endCron = trigger.prepareCondition.endCron.split(' ');
        var intervalType = '';

        var _cronTypeString = startCron.slice(3, 6).join(' ');
        
        switch(_cronTypeString){
          case TriggerDetailService.CronTypes.DAILY:
            intervalType = 'DAILY';
            break;
          case TriggerDetailService.CronTypes.WEEKDAY:
            intervalType = 'WEEKDAY';
            break;
          case TriggerDetailService.CronTypes.WEEKEND:
            intervalType = 'WEEKEND';
            break;
        }

        var cronSpan = {
          startAt: convertCronToTime(startCron),
          endAt: convertCronToTime(endCron),
          intervalType: intervalType
        };

        return cronSpan;

        function convertCronToTime(cronArr){
          var d = new Date();
          d.setHours(parseInt(cronArr[2]));
          d.setMinutes(parseInt(cronArr[1]));
          d.setSeconds(parseInt(cronArr[0]));
          d.setMilliseconds(0);

          return d;
        }

      }else{

      }
    }



    TriggerDetailService.isNewTrigger = function(){
      return ($rootScope.$state.current.name.indexOf(TriggerDetailService.States.NEW_TRIGGER_ROOT) > -1);
    };

    
    TriggerDetailService.generatePrepareCondition = function(triggerDataset){
      if(!triggerDataset) return null;

      var startAt = triggerDataset.timeSpan.startAt,
          endAt = triggerDataset.timeSpan.endAt;

      var startMin = '0',
          startHour = '0',
          endMin = '59',
          endHour = '23';

      if(startAt){
        startMin = startAt.getMinutes();
        startHour = startAt.getHours();
        if(!endAt){
          return null;
          endAt = new Date();
          endAt.setHours(23);
          endAt.setMinutes(59);
        }
        endMin = endAt.getMinutes();
        endHour = endAt.getHours();
      }else{
        return null;
      }

      var startCron = [
          0, 
          startMin,
          startHour,
          TriggerDetailService.CronTypes[triggerDataset.timeSpan.intervalType]
        ].join(' '),

          endCron = [
          0, 
          endMin,
          endHour,
          TriggerDetailService.CronTypes[triggerDataset.timeSpan.intervalType]
        ].join(' ');

      return {
        "type": 'cron',
        "startCron": startCron,
        "endCron": endCron
      };
    };

    TriggerDetailService.generateTargets = function(triggerDataset){
      return _.map(triggerDataset.actionGroups, function(actionGroup){
        var actions = [];
        var target = {
          "thingList": _.pluck(actionGroup.things, 'globalThingID'),
          "command" : {
            "actions" : actions,
            "schemaVersion" : 0,
            "metadata" : {
              "type": actionGroup.type
            }
          }
        };

        _.each(actionGroup.actions, function(action){
          var _action = {};
          _action[action.actionName] = {};

          _.each(action.properties, function(property){
            _action[action.actionName][property.propertyName] = property.value;
          });
          actions.push(_action);
        });

        return target;
      });
    };



    return TriggerDetailService;
  }
]);