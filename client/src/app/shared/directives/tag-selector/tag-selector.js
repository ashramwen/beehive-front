angular.module('BeehivePortal')
  .directive('tagSelector', ['$compile', function($compile) {
      return{
        restrict: 'E',
        scope:{
            selectedTags: '=?'
        },
        templateUrl: 'app/shared/directives/tag-selector/tag-selector.template.html',
        controller:['$scope', '$$Tag', 'PermissionControl', function($scope, $$Tag, PermissionControl){
            
            $scope.settings = {
                'name': 'displayName',
                'id': 'displayName',
                'unselectedTitle': '未选标签',
                'selectedTitle': '已选标签'
            };

            $scope.init = function(){
                $scope.tagAllowed = PermissionControl.isAllowed('SEARCH_TAGS');
                if($scope.tagAllowed){
                    $scope.tags = $$Tag.queryAll();
                }
            };
        }]
      };
  }]);