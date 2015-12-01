angular.module('BeehivePortal')
  .factory('PortalService', ['$http', '$q', 'Session', function($http, $q, Session) {
    var portalService = {};
    // TODO
    portalService.getLocation = function(){
        return $http({
            url: 'app/data/location.json',
            method: 'get',
            cache: true
        });
    };

    return portalService;
  }]);
