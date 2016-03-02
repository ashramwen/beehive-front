angular.module('BeehivePortal')
  .directive('itemSelector', ['$compile', function($compile) {
      return{
        restrict: 'E',
        replace: true,
        scope:{
            items: '=?',
            selectedItems: '=?',
            settings: '=?',
            disabled: '=?'
        },
        templateUrl: 'app/shared/directives/item-selector/item-selector.template.html',
        controller:['$scope', function($scope){
            
            $scope.items = $scope.items || [];
            $scope.selectedItems = $scope.selectedItems || [];

            var settings = {
                name: 'name',
                id: 'name',
                unselectedTitle: 'Unselected',
                selectedTitle: 'Selected'
            };

            $scope.settings = $scope.settings || {};
            $scope.settings = _.extend(settings, $scope.settings);

            $scope.$watch('items', function(){
                $scope.whenItemChange();
            },true);

            /*
             * tree settings
             */
            $scope.treeOptions = {
                multiSelection: false,
                nodeChildren: "children",
                dirSelectable: true,
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "a8"
                }
            };

            $scope.init = function(){
                $scope.whenItemChange();
            };

            $scope.selectLeftItem = function(item){
                $scope.selectedLeftItem = item;
            };

            $scope.selectRightItem = function(item){
                $scope.selectedRightItem = item;
            };

            $scope.whenItemChange = function(){
                $scope.unselectedItems = _.filter($scope.items, $scope.unselectedFilter);
            };

            $scope.unselectedFilter = function(item){
                return !_.find($scope.selectedItems, function(selectedItem){
                    return selectedItem[settings.id] == item[settings.id];
                });
            };

            $scope.addItem = function(item){
                if(!item) return;
                $scope.selectedLeftItem = null;
                $scope.selectedItems.push(item);
                $scope.whenItemChange();
            };

            $scope.removeItem = function(item){
                if(!item) return;
                $scope.selectedRightItem = null;
                $scope.selectedItems.remove(item);
                $scope.whenItemChange();
            };
            
        }]
    };
  }]);