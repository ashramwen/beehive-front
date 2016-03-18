angular.module('BeehivePortal')
  .directive('sourcePicker',['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            mySource: '=?',
            ready: '=?',
            disabled: '=?'
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/select-source/select-source.template.html',
        controller: ['$scope', '$$Tag', '$$Thing', '$timeout', '$q', function($scope, $$Tag, $$Thing, $timeout, $q){

            $scope.$watch('mySource.tagTypes', function(newVal){
                $scope.mySource.thingTypes = [];
                _.each(newVal, function(val){
                    $scope.mySource.thingTypes.push({label: val, id: val});
                });
                
            }, true);

            $scope.$watch('mySource.sourceType', function(newVal){
                if(newVal == 'tag'){
                    delete $scope.mySource.thingList;
                }else{
                    delete $scope.mySource.tagList;
                }
            });

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

            $scope.init = function(){
                $scope.mySource = $scope.mySource || {};

                if($scope.mySource.tagList){
                    $scope.mySource.sourceType = $scope.sourceTypes[1].value;
                }else{
                    $scope.mySource.sourceType = $scope.sourceTypes[0].value;
                }
            };

            $scope.mySource.selectedType = {};

            $scope.thingTypeChange = function(item, bSelect){
                
            };
        }]
    }
  }]);