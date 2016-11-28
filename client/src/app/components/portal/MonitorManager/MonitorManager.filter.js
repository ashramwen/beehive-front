'use strict';

angular.module('BeehivePortal.MonitorManager')

.filter('valueDesc', function() {
    return function(value, options) {
        return options.find(function(o) {
            return o.value === value
        }).text || value;
    };
});