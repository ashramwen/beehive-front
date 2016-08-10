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
            includeSubLevel: false
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

        $defer.resolve(queriedSubLevels);
      });

      return $defer.promise;
    };

    ReportingService.getAllThings = function(locations){

      locations = [
        {things: [1300,1301,1302], location: {displayName: '1楼', location: '01'}},
        {things: [1303,1304,1305], location: {displayName: '2楼', location: '02'}},
        {things: [1306,1307,1308], location: {displayName: '3楼', location: '03'}}
      ];
      
      var allThings = [];
      _.each(locations, function(location){
        allThings = allThings.concat(location.things);
      });
      return allThings;
    };

    ReportingService.getLocationEnums = function(locations){
      var enumObj = {values: [], keys: [], field: 'id'};

      locations = [
        {things: [1300,1301,1302], location: {displayName: '1楼', location: '01'}},
        {things: [1303,1304,1305], location: {displayName: '2楼', location: '02'}},
        {things: [1306,1307,1308], location: {displayName: '3楼', location: '03'}}
      ];

      _.each(locations, function(location){
        if(!location.things.length){
          return;
        }
        enumObj.values.push(location.things);
        enumObj.keys.push(location.location.displayName);
      });

      return enumObj;
    }


    return ReportingService;
  }]);