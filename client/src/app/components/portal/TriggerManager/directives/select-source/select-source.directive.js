angular.module('BeehivePortal')
  .directive('sourcePicker',['$compile', '$$Tag', '$$Thing', '$timeout', function($compile, $$Tag, $$Thing, $timeout){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            mySource: '=?',
            ready: '=?'
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/select-source/select-source.template.html',
        controller: function($scope, $$Tag, $$Thing, $timeout, $q){

            $scope.$watch('mySource.tagList', function(newVal){
                console.log(newVal);
            }, true);

            $scope.sourceTypes = [
                {
                    text: '设备',
                    value: 'thing'
                },
                {
                    text: '标签',
                    value: 'tag'
                }
            ];

            $scope.andExpressOptions = [
                {
                    text: '交集',
                    value: true
                },
                {
                    text: '并集',
                    value: false
                }
            ];

            $scope.mySource = $scope.mySource || {};

            $scope.init = function(){
                if($scope.mySource.tagList){
                    $scope.sourceType = $scope.sourceTypes[1];
                }else{
                    $scope.sourceType = $scope.sourceTypes[0];
                }
            };
        }
    }
  }]);