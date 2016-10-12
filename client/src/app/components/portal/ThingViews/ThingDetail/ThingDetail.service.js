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

    ThingDetailService.getThingHistoryState = function(vendorThingID, pageIndex, from, to){
      var $defer = $q.defer();

      var pageLength = 20;
      var payload = {
          vendorThingID: vendorThingID,
          startDate: from.getTime(),
          endDate: to.getTime(),
          size: 20,
          from: pageIndex * pageLength
      };

      $$Thing.getHistory(payload, function(response){

        var result = {
          total: response.total,
          from: pageIndex * pageLength,
          size: 20,
          states: _.pluck(response.hits, '_source').map(function(source){
            return source.state;
          }) 
        };

        $defer.resolve(result);
      }, $defer.reject);

      return $defer.promise;
    }

    return ThingDetailService;
  }]);
