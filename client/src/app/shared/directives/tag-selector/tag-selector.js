angular.module('BeehivePortal')
  .directive('tagSelector', ['$compile', function($compile) {
      return{
        restrict: 'E',
        scope:{
            selectedTags: '=?',
            tagTypes: '=?'
        },
        templateUrl: 'app/shared/directives/tag-selector/tag-selector.template.html',
        controller:['$scope', '$$Tag', '$$Location', '$$Thing', function($scope, $$Tag, $$Location, $$Thing){
            
            $scope.settings = {
                'name': 'displayName',
                'id': 'displayName',
                'unselectedTitle': '未选标签',
                'selectedTitle': '已选标签'
            };

            $scope.tagThings = [];

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
                $scope.dataset = {};
                
                if($scope.tagAllowed){
                    $scope.dataset.tags = $$Tag.queryAll();
                }

                if($scope.locationAllowed){
                    $$Location.queryAll(function(locations){
                        $scope.dataset.locations = (new LocationTree(_.pluck(locations, 'displayName'))).tree.children;
                    });
                }
                $scope.whenSelectedItemChange();
            };

            $scope.addItem = function(node){
                var tagFullName = '';
                if(node.fullTagName){
                    tagFullName = $scope.addTag(node);
                }else{
                    tagFullName = $scope.addLocation(node);
                }

                $scope.selectedTags = $scope.selectedTags || [];
                if($scope.selectedTags.indexOf(tagFullName) > -1)return;
                
                var $defer = searchByTag(tagFullName).$promise;

                $defer.then(function(things){
                    if($scope.selectedTags.indexOf(tagFullName) >-1) return;
                    $scope.selectedTags.push(tagFullName);
                    $scope.tagThings.push({
                        fullTagName: tagFullName,
                        things: things
                    });
                    $scope.whenSelectedItemChange();
                });
            };

            $scope.addTag = function(tag){
                $scope.selectedTags = $scope.selectedTags || [];
                return tag.fullTagName;
            };

            $scope.addLocation = function(treeNode){
                var fullTagName = 'Location-' + treeNode.id;
                return fullTagName;
            };

            $scope.selectLeftItem = function(item){
                $scope.selectedLeftItem = item;
            };

            $scope.selectRightItem = function(item){
                $scope.selectedRightItem = item;
            };

            $scope.removeItem = function(node){
                $scope.selectedTags.remove(node.id);
                $scope.tagThings = _.reject($scope.tagThings, function(item){
                    return item.fullTagName == node.id;
                });

                $scope.whenSelectedItemChange();
            };

            $scope.whenSelectedItemChange = function(){
                $scope.selectedItems = [];
                _.each($scope.selectedTags, function(tag){
                    $scope.selectedItems.push({name: tag, id: tag});
                });

                $scope.tagTypes = [];

                _.each($scope.tagThings, function(item){
                    $scope.tagTypes = $scope.tagTypes.concat(_.pluck(item.things, 'type'));
                });
                $scope.tagTypes = _.uniq($scope.tagTypes);
            };

            $scope.selectedThings = [];

            function searchByTag(tagFullName){
                var index = tagFullName.indexOf('-');
                var type = tagFullName.substr(0, index);
                var displayName = tagFullName.substr(index + 1, tagFullName.length - index - 1);
                return searchThings(type, displayName);
            };

            function searchThings(type, displayName){
                return $$Thing.byTag({tagType: type, displayName: displayName});
            }
        }]
      };
  }]);