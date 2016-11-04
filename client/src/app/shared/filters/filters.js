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
})
.filter('TimePipe', function(){
    return function(date){
        var t = new Date(date);
        var time = _.map([t.getHours(), t.getMinutes(), t.getSeconds()], function(i){
            var a = ('0' + i).substr();
            return a.substr(a.length - 2, 2);
        }).join(':');
        return [new Date(date).toLocaleDateString(), time].join(' ');
    }
})
.filter('DatePipe', function(){
    return function(date){
        return new Date(date).toLocaleDateString();
    }
});