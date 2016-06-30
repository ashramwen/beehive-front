'use strict';

angular.module('BeehivePortal')
  .directive('propertyTree', ['$compile', '$http', function($compile, $http){
    return {
        restrict: 'E',
        replace: true,
        scope:{
            myProperty: '=?'
        },
        link: function($scope, $element, $attr){
            $http({
                method:'GET',
                url:'app/components/portal/ThingViews/TypeView/directives/property-tree/property-tree.template.html'
            }).then(function(response){

                var template = response.data;
                if($scope.myProperty){
                    var html = $compile(template)($scope);
                    $element.append(html);
                }
                $scope.collapseControllers = {};

                $scope.propertyRequired = function(property, required){
                    if(!required) return false;
                    return !! _.find(required, function(propertyName){
                      return propertyName == property;
                    });
                };
            });
        }
    };
}]);