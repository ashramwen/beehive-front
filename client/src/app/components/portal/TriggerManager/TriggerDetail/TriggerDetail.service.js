'use strict';

angular.module('BeehivePortal')
  .factory('TriggerDetailService',['$rootScope', '$$Type', '$q' , '$$Thing', function($rootScope, $$Type, $q, $$Thing) {
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

    TriggerDetailService.parseSchema = function(schema){
      return {
        displayName: schema.content.statesSchema.title,
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
        var propertyNames = _.pluck(typeSource.expressList, 'stateName');

        var properties = _.map(propertyNames, function(propertyName){

          var propertyExp =_.find(trigger.predicate.condition.clauses, {field: type + '.' + propertyName});
          var expression = '';
          var value = null;
          if(!propertyExp) return;
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
          if(propertyExp.hasOwnProperty('equals')){
            expression = 'eq';
            value = propertyExp.equals;
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

          $defer.resolve(resultMap);
        });
      });

      return $q.all(promiseList);
    };

    TriggerDetailService.getExpressionDisplay = {
      'eq': '＝',
      'gt': '＞',
      'gte': '≥',
      'lt': '＜',
      'lte': '≤'
    };

    TriggerDetailService.timeUnits = [
      {text: '小时', value: 'hour'},
      {text: '分钟', value: 'minute'}
    ];

    TriggerDetailService.isNewTrigger = function(){
      return ($rootScope.$state.current.name.indexOf(TriggerDetailService.States.NEW_TRIGGER_ROOT) > -1);
    };

    return TriggerDetailService;
  }
]);