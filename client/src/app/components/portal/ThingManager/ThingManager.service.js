angular.module('BeehivePortal')
  .factory('ThingManagerService', ['$http', '$q', 'Session', function($http, $q, Session) {
    var thingManagerService = {};
    
    thingManagerService.getThings = function(){
        return $http({
            url: 'app/data/things.json',
            method: 'get'
        });
    }

    thingManagerService.getThingsByType = function(type){
        return $http({
            url: 'app/data/things.json',
            method: 'get'
        });
    }

    thingManagerService.getTypes = function(){
        return $http({
            url: 'app/data/thingType.json',
            method: 'get'
        });
    }

    thingManagerService.getTags = function(){
        return $http({
            url: 'app/data/thingType.json',
            method: 'get'
        });
    }

    return thingManagerService;
  }]);
