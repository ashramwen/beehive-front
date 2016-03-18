'use strict';

angular.module('BeehivePortal')
  .directive('multiSourcePicker', ['$compile', '$$Tag', '$$Thing', '$timeout', 'AppUtils', function($compile, $$Tag, $$Thing, $timeout, AppUtils){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            sources: '=',
            resultSourceSet: '=?',
            disabled: '=?'
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/select-multiple-source/select-multiple-source.template.html',
        controller: function($scope, $$Tag, $$Thing, $timeout, $q){

            $scope.removeSource = function(source){
                AppUtils.confirm('删除源', '您确定要删除源吗？', function(){
                    $scope.sources.remove(source);
                });
            };
        }
    };
  }]);