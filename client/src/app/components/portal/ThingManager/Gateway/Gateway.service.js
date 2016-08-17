angular.module('BeehivePortal')
  .factory('GatewayService', ['$$Type', 'TriggerDetailService', '$q', function($$Type, TriggerDetailService, $q){
    var GatewayService = {};

    GatewayService.getThingsDetail = function(things){
      var $defer = $q.defer();

      var promiseList = [];
      _.each(things, function(thing){
          var $promise = $$Type.getSchema({type: thing.type}, function(schema){
              schema = TriggerDetailService.parseSchema(schema);
              thing.actions = schema.actions;
              thing.typeDisplayName = schema.displayName;

              var properties = schema.properties;
              thing.status = _.map(thing.status, function(value, key){
                  var property = _.find(properties, {propertyName: key});
                  return {
                      displayName: property ? property.displayName : key,
                      value: value,
                  };
              });

          });

          promiseList.push($promise);
      });
      $q.all(promiseList).then(function(things){
        $defer.resolve(things);
      });

      return $defer.promise;
    };
    

    return GatewayService;
  }]);