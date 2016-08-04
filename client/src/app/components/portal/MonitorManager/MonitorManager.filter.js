'use strict';

angular.module('BeehivePortal.MonitorManager')

.filter('typeName', ['ThingType', function(ThingType) {
    return function(type) {
        return ThingType[type] || type;
    };
}]);