angular.module('BeehivePortal').filter('checked', function () {
  return function (items) {
    if(_.isArray(items)){
        return _.where(items, {_checked: true});
    }else{
        var obj = {};
        _.each(items, function(value, key){
            if(value._checked){
                obj[key] = value;
            }
        });
        
        return obj;
    }
    
  };
});