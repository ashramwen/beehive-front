'use strict';

angular.module('BeehivePortal')
  .factory('TriggerDetailService',['$rootScope', '$$Type', '$q' , '$$Thing', '$$Location', function($rootScope, $$Type, $q, $$Thing, $$Location) {
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
      
      NEW_SCHEDULE_TRIGGER_ACTION: 'app.portal.TriggerManager.NewTrigger.ScheduleTriggerActionHandler',
      SCHEDULE_TRIGGER_ACTION: 'app.portal.TriggerManager.TriggerDetail.ScheduleTriggerActionHandler',

      NEW_SCHEDULE_TRIGGER: 'app.portal.TriggerManager.NewTrigger.ScheduleTrigger',
      SCHEDULE_TRIGGER: 'app.portal.TriggerManager.TriggerDetail.ScheduleTrigger',
      NEW_CONDITION_TRIGGER: 'app.portal.TriggerManager.NewTrigger.ConditionTrigger',
      CONDITION_TRIGGER: 'app.portal.TriggerManager.TriggerDetail.ConditionTrigger',

      NEW_TRIGGER_ROOT: 'app.portal.TriggerManager.NewTrigger'
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
        displayName: schema.content.statesSchema.title,
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
            values = [false, true];
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
          var actionName = _.keys(action)[0];
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

          _.each(actions, function(action){
            var _action = _.find(_schema.actions, {actionName: action.actionName});
            _.extend(action, {displayName: _action.displayName});
            _.each(action.properties, function(property){
              var _property = _.find(_action.properties, {propertyName: property.propertyName});
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

      _.each(trigger.summarySource, function(typeSource, key){
        var $defer = $q.defer();
        promiseList.push($defer.promise);

        var thingPromiseList = [];

        var type = key;
        var things = _.map(typeSource.source.thingList, function(globalThingID){

          return {
            globalThingID: globalThingID,
            typeDisplayName: '',
            type: type,
            location: '',
            locationDisplayName: ''
          };
        });

        var $thingsPromise = TriggerDetailService.getThingsDetail(things);

        var propertyNames = _.pluck(typeSource.expressList, 'stateName');

        var properties = _.map(propertyNames, function(propertyName){
          var clauses = [];
          trigger.predicate.condition.clauses.pop();
          _.each(trigger.predicate.condition.clauses, function(clause){
            clause.clauses.pop();
            clauses = clauses.concat(clause.clauses);
          });

          var propertyExp = _.find(clauses, {field: type + '.' + propertyName});
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

        var resultMap = {
          properties: properties,
          type: type,
          things: things
        };

        var $typeDefer = $q.defer();
        var $typePromise = $typeDefer.promise;

        $$Type.getSchema({type: type}, function(schema){
          var _schema = TriggerDetailService.parseSchema(schema);

          _.each(properties, function(property){
            var _property = _.find(_schema.properties, {propertyName: property.propertyName});
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

      return $q.all(promiseList);
    };

    TriggerDetailService.getThingsDetail = function(things){
      var $defer = $q.defer();
      var locationsSuffix = ['楼','层', '区域'];

      $$Thing.getThingsByIDs({}, _.pluck(things, 'globalThingID'), function(thingsWithLocation){
        var locationPromiseList = [];
        
        _.each(things, function(thing){
          var _thing = _.find(thingsWithLocation, {id: thing.globalThingID});
          thing.location = _thing.locations[0];
          locationPromiseList.push(TriggerDetailService.getLocationTree(thing.location));
        });

        $q.all(locationPromiseList).then(function(locationGroups){
          _.each(things, function(thing, i){
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
      return $defer.promise;
    }

    
    TriggerDetailService.getLocationTree = function(locationID){
      var $defer = $q.defer();

      $$Location.getParent({location: locationID}, function(locations){
        var location = _.find(locations, {location: locationID});
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

      if(!startAt) return null;

      if(!endAt){
        endAt = new Date();
        endAt.setHours(23);
        endAt.setMinutes(59);
      }

      var startCron = [
          0, 
          startAt.getMinutes(),
          startAt.getHours(),
          TriggerDetailService.CronTypes[triggerDataset.timeSpan.intervalType]
        ].join(' '),

          endCron = [
          0, 
          endAt.getMinutes(),
          endAt.getHours(),
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
        var _action = {};
        var target = {
          "thingList": _.pluck(actionGroup.things, 'globalThingID'),
          "command" : {
            "actions" : [_action],
            "schemaVersion" : 0,
            "metadata" : {
              "type": actionGroup.type
            }
          }
        };

        _.each(actionGroup.actions, function(action){
          _action[action.actionName] = {};

          _.each(action.properties, function(property){
            _action[action.actionName][property.propertyName] = property.value;
          });
        });

        return target;
      });
    };



    return TriggerDetailService;
  }
]);