'use strict';

angular.module('BeehivePortal.MonitorManager')

.filter('locTag', function() {
    return function(loc) {
        var temp = loc.split('-');
        return temp[0] + '-' + temp[1];
    };
})

.filter('typeName', ['ThingType', function(ThingType) {
    return function(type) {
        return ThingType[type] || type;
    };
}]);