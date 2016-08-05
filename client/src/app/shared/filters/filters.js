angular.module('BeehivePortal')

.filter('checked', function() {
    return function(items) {
        if (_.isArray(items)) {
            return _.where(items, { _checked: true });
        } else {
            var obj = {};
            _.each(items, function(value, key) {
                if (value._checked) {
                    obj[key] = value;
                }
            });
            return obj;
        }
    };
})

.filter('locTag', function() {
    return function(loc) {
        var temp = loc.split('-');
        return temp[0] + '-' + temp[1];
    };
});