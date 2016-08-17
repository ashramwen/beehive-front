angular.module('BeehivePortal')
  .factory('ThingDetailService', ['$http', '$q', 'Session', '$$Type', '$$Thing', 'TriggerDetailService', function($http, $q, Session, $$Type, $$Thing, TriggerDetailService) {
    var ThingDetailService = {};

    ThingDetailService.getThing = function(id){
      var $defer = $q.defer();
      var quriedThing = {};

      $$Thing.get({globalThingID: id}, function(thing){
          quriedThing = thing;
          $$Thing.getOnboardingInfo({vendorThingID: thing.vendorThingID}, function(onboardingInfo){
              _.extend(quriedThing, onboardingInfo);

              TriggerDetailService
                .getThingsDetail([{globalThingID: id}]).then(function(things){
                  quriedThing.locationDisplayName = things[0].locationDisplayName;
                });

              $$Type.getSchema({type: quriedThing.type}, function(schema){
                  schema = TriggerDetailService.parseSchema(schema);
                  quriedThing.actions = schema.actions;
                  quriedThing.typeDisplayName = schema.displayName;
                  var properties = schema.properties;
                  thing.status = _.map(quriedThing.status, function(value, key){
                      var property = _.find(properties, {propertyName: key});
                      return {
                          displayName: property ? property.displayName : key,
                          value: value,
                      };
                  });

                  $defer.resolve(quriedThing);
              });
          });
      });
      return $defer.promise;
    };

    return ThingDetailService;
  }]);
