angular.module('BeehivePortal')
  .directive('pagion', ['$compile', '$location', '$rootScope', function($compile, $location, $rootScope){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            collection: '=?',
            display: '=?',
            index: '=?',
            onChanged: '=?'
        },
        templateUrl: 'app/shared/directives/pagion/pagion.template.html',
        link: function(scope, element, attrs){
            scope.listMaxLength = window.pageListMaxLength;
            scope.index = scope.index || 1;

            scope.pageChanged = function(){
                findItemsForDisplay();

                $location.search(_.extend({'pageIndex': scope.index}, $rootScope.$state.params));
                if(_.isFunction(scope.onChanged)){
                    scope.onChanged(scope.index, scope.display);
                }
            };

            function findItemsForDisplay(){
                scope.display = _.filter(scope.collection, function(item, index){
                    return index >= (scope.index - 1) * scope.listMaxLength 
                            && index < scope.index * scope.listMaxLength;
                });
            };

            scope.$watch('collection', function(newVal ,oldVal){
                findItemsForDisplay();
            }, true);
        }
    }
  }]);