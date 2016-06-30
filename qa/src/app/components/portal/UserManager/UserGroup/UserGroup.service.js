angular.module('BeehivePortal')
  .factory('UserGroupService', ['$http', '$q', 'Session', function($http, $q, Session) {
    var userGroupService = {};
    // TODO

    userGroupService.getUserGroups = function(){
        return $http({
            url: 'app/data/userGroup.json',
            method: 'get'
        });
    };

    userGroupService.getGroup = function(){
        return $http({
            url: 'app/data/group.json',
            method: 'get'
        });
    }
    return userGroupService;
  }]);
