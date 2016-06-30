angular.module('BeehivePortal')
  .directive('multiSelector', ['$compile', function($compile){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            ngModel: '=?',
            options: '=?',
            onChange: '=?',
            single: '=?',
            disabled: '=?'
        },
        templateUrl: 'app/shared/directives/multi-selector/multi-selector.template.html',
        controller: ['$scope', function($scope){
            $scope.dataset = {
                settings: {
                    externalIdProp: '', 
                    showCheckAll: false, 
                    showUncheckAll: false,
                    scrollable: false,
                    smartButtonMaxItems: 3,
                    smartButtonTextConverter: function(itemText, originalItem) {
                        return itemText;
                    }
                },
                events:{}
            };
            $scope.tmp = {};

            if($scope.onChange){
                var events = {
                    onItemSelect: function(item){
                        if($scope.single && angular.equals($scope.tmp, item)){
                            $scope.ngModel = {};
                            $scope.onChange(item, false);
                            $scope.tmp = {};
                        }else{
                            $scope.tmp = item;
                            $scope.onChange(item, true);
                        }
                    },
                    onItemDeselect: function(item){
                        
                    }
                }
                _.extend($scope.dataset.events, events); 
            }

            if($scope.single){
                $scope.dataset.settings.selectionLimit = 1;
            }
        }]
    };
  }]);