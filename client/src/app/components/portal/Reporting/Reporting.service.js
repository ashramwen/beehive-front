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

        queriedSubLevels = _.map(result, function(things, i){
          var thingIDs = _.pluck(things, 'thingID'); 
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
      allThings = _.without(allThings, null, undefined);

      return allThings;
    };

    ReportingService.getLocationEnums = function(locations){
      var enumObj = {values: [], keys: [], field: 'state.target'};

      _.each(locations, function(location){
        location.things = _.without(location.things, null, undefined);
        if(!location.things.length){
          return;
        }
        enumObj.values.push(location.things);
        enumObj.keys.push(ReportingService.getLocationName(location.location.displayName));
      });

      return enumObj;
    };

    ReportingService.getLocationName = function(location){

      var suffix = '';
      var locationName = '';

      switch(location.length){
        case 9:
          suffix = '工位';
          locationName = location.substr(7);
          break;
        case 7:
          suffix = '区块';
          locationName = location.substr(6);
          break;
        case 5:
          suffix = '区域';
          locationName = location.substr(4);
          break;
        case 4:
          locationName = location.substr(2);
          suffix = '层'
          break;
        case 2:
          suffix = '楼'
          locationName = location;
          break;
      }

      return locationName + suffix;
    };


    return ReportingService;
  }]);