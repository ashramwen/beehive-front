angular.module('BeehivePortal')
  .factory('ReportingService', ['AppUtils', '$$Thing', '$q', function(AppUtils, $$Thing, $q){
    var ReportingService = {};

    ReportingService.getLocationThings = function(type, selectedSubLevels){
      var $defer = $q.defer();

      var promiseList = [];


      var queriedSubLevels = [];
      if(selectedSubLevels){

        var subLevelsPromiseList = _.map(selectedSubLevels, function(subLevel){
          var searchQuery = {
            type: type, 
            locationPrefix: subLevel.location, 
            includeSubLevel: true
          };

          return $$Thing.getThingsByLocationType(searchQuery).$promise;
        });

        promiseList = subLevelsPromiseList;
      }

      /**
       * get locatios
       */
      $q.all(promiseList).then(function(result){

        queriedSubLevels = _.map(result, function(thingIDs, i){
          return{
            location: selectedSubLevels[i],
            things: thingIDs
          }
        });

        var allThingPromises = [];
        _.each(queriedSubLevels, function(level){
          var thingPromise = $$Thing.getThingsByIDs(level.things, function(queriedThings){
            level.things = _.pluck(queriedThings, 'kiiThingID');;
          }).$promise;
          allThingPromises.push(thingPromise);
        });

        $q.all(allThingPromises).then(function(){
          $defer.resolve(queriedSubLevels);
        });

      });

      return $defer.promise;
    };

    ReportingService.getAllThings = function(locations){

      var allThings = [];
      _.each(locations, function(location){
        allThings = allThings.concat(location.things);
      });

      return allThings;
    };

    ReportingService.getLocationEnums = function(locations){
      var enumObj = {values: [], keys: [], field: 'target'};

      _.each(locations, function(location){
        if(!location.things.length){
          return;
        }
        enumObj.values.push(location.things);
        enumObj.keys.push(location.location.displayName);
      });

      return enumObj;
    };


    return ReportingService;
  }]);