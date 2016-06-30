angular.module('BeehivePortal')
  .directive('thingPicker',['$compile', '$$Tag', '$$Thing', '$timeout', function($compile, $$Tag, $$Thing, $timeout){
    return{
        restrict: 'E',
        replace: true,
        scope:{
            selectedNodes: '=?',
            settings: '=?',
            ready: '=?'
        },
        templateUrl: 'app/shared/directives/thing-picker/thing-picker.template.html',
        controller: function($scope, $$Tag, $$Thing, $timeout, $q){

            var settings = {
                tabs:[],
                id: 'id',
                data:[]
            };

            /*
             * example tab
             */

            $scope.tabs = [];
            $scope.settings = $scope.settings || {};
            $scope.settings = _.extend(settings, $scope.settings);
            $scope.tabs = $scope.settings.tabs;

            /*
             * tab controller
             */ 
            $scope.selecteTab = function(selectedTab){
                $timeout(function(){
                    _.each($scope.tabs,function(tab){
                        tab.active = false;
                    });
                    selectedTab.active = true;
                });
                
                $scope.treeLeft = selectedTab.treeLeft;
                $scope.treeRight = selectedTab.treeRight;
            };

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

            /**
             * when ready
             */
            $scope.$watch('ready', function(newVal, oldVal){
                if(newVal == true){
                    $timeout($scope.onReady);
                }
            });

            /*
             * init tree node for dispaly
             */
            function initNode(node, ancentIds, id){
                node.ancentIds = ancentIds;
                node.id = id;
                
                _.each(node.children, function(child, index){
                    var newAncentIds = _.clone(ancentIds);
                    newAncentIds.push(node.id);
                    var childId = id + index;
                    initNode(child, newAncentIds, childId);
                });
            }

            $scope.init = function(){
                _.each($scope.tabs,function(tab){
                    tab.active = false;
                    tab.treeLeft = [];
                    tab.treeRight = [];
                });
                $scope.selecteTab($scope.tabs[0]);
                /*
                 * trees setting
                 */
                $scope.treeLeft = $scope.tabs[0].treeLeft;
                $scope.treeRight = $scope.tabs[0].treeRight;
            }

            $scope.onReady = function(){
                $scope.existingNodes = $scope.settings.existingNodeIDs;
                $scope.queriedNodes = $scope.settings.dataset.data;

                _.each($scope.tabs,function(tab){
                    treeDataInit(tab.dataset, $scope.queriedNodes, tab);
                });

                moveExistingNodes($scope.queriedNodes ,$scope.existingNodes);

                /*
                 * move existing things from left tree to right
                 */

                function moveExistingNodes(queriedNodes, existingNodeIDs){
                    var myNodes = _.filter(queriedNodes, function(node){
                        return _.find(existingNodeIDs, function(existingNodeID){
                            return existingNodeID == node[settings.idFieldName];
                        });
                    });

                    /*
                     * move selected node to right
                     */
                    _.each(myNodes, function(myNode){
                        _.each(myNode.clones, function(clone){
                            $scope.switchNodeReferences(clone, true);
                        });
                    });
                }

                function treeDataInit(dataset, queriedNodes, tab){
                    var mapper = tab.mapper,
                        leftTree = tab.treeLeft,
                        rightTree = tab.treeRight,
                        nameGenerator = tab.nameGenerator,
                        treeName = tab.name;

                    if(mapper){
                        _.each(dataset, function(dataNode){
                            retrieve(dataNode, function(data){
                                data.children = data.children || [];
                                data.name = data[mapper.nameFieldName];
                                data.isFolder = true;

                                _.each(queriedNodes, function(node){
                                    if(node[mapper.mapperFieldName]===null) return;
                                    if(node[mapper.mapperFieldName]===data[mapper.idFieldName] 
                                            || (node[mapper.mapperFieldName] instanceof Array && node[mapper.mapperFieldName].indexOf(data[mapper.idFieldName])>-1)){
                                        var clone = _.clone(node);

                                        _.extend(clone, {
                                            name: nameGenerator(clone),
                                            reference: node,
                                            referencedLeftTree: leftTree,
                                            referencedRightTree: rightTree
                                        });

                                        node.clones = node.clones || [];
                                        node.clones.push(clone);
                                        data.children.push(clone);
                                    }
                                    
                                });
                            });
                        })
                    }else{
                        _.each(dataset,function(data){
                            _.extend(data,{
                                name: nameGenerator(data),
                                reference: data,
                                referencedLeftTree: leftTree,
                                referencedRightTree: rightTree
                            })
                            data.clones = data.clones || [];
                            data.clones.push(data);
                        });
                    }

                    _.each(dataset, function(node, index){
                        initNode(node, [''], treeName + index.toString());
                        leftTree.push(node);
                        node.container = leftTree;
                    });

                    _.each(dataset, function(data){
                        retrieve(data, function(node){
                            if((!node.children || node.children.length == 0) && node.isFolder){
                                node.container.remove(node);
                            }
                        });
                    });
                    
                }
            };

            /*
             * switch node from tree1 to tree2
             */
            $scope.switchNode = function(node, tree1, tree2){

                var treeNodes = getNodesByIds(node.ancentIds.removeFirst(), tree1);
                if(!treeNodes || treeNodes.length == 0){
                    if(!node.isFolder && tree1.indexOf(node)>-1){
                        tree2.push(node);
                        tree1.remove(node);
                    }
                    return;
                } 
                if(_.where(treeNodes[0].children, {id:node.id}).length==0) return;
                treeNodes = treeNodes.reverse();

                var myAncents = _.clone(treeNodes);
                _.each(myAncents,function(ancent,index){
                    myAncents[index] = _.clone(ancent);
                    myAncents[index].children = [];
                });

                
                var flag = true,
                    target = tree2;

                _.each(myAncents,function(ancent, index){
                    if(!flag)return;
                    var targetNode = _.find(target,function(child){
                        return ancent.id === child.id;
                    });

                    if(!targetNode){
                        flag = false;
                        for(var i = index; i < myAncents.length; i++){
                            var tmpNode = _.clone(myAncents[i]);
                            tmpNode.children = [];
                            target.push(tmpNode);
                            target = tmpNode.children;
                        }
                    }else{
                        target = targetNode.children;
                    }
                });

                var flag = _.find(target,function(child){
                    return child.id == node.id;
                })

                if(!flag) target.push(node);

                /*
                 * remove item and empty folder
                 */
                var parent;
                if(myAncents.length>0){
                    parent = _.last(treeNodes).children;
                }else{
                    parent = tree1;
                }
                parent.splice(parent.indexOf(node),1);

                clearEmptyFolder(tree1, treeNodes);
                
                /*
                 * get nodes by given ids
                 */
                function getNodesByIds(ids,nodes){
                    if(ids.length == 0)return [];

                    var reNode = _.find(nodes,function(node){
                        return node.id == ids[0];
                    });
                    if(!reNode) return undefined;

                    var result = getNodesByIds(ids.removeFirst(), reNode.children);
                    if(result == undefined) return undefined;
                    
                    return result.concat([reNode]);
                }

                /*
                 * clear parents that has no children
                 */
                function clearEmptyFolder(tree, ancents){
                    if(ancents.length == 0){
                        return;
                    }
                    var lastAncent = _.last(ancents);
                    if(lastAncent.children.length == 0 && ancents.length > 1){
                        var grandFather = ancents[ancents.length - 2];
                        grandFather.children.splice(grandFather.children.indexOf(lastAncent), 1);
                        clearEmptyFolder(tree, ancents.slice(0,ancents.length-1));
                    }else if(ancents.length==1 && lastAncent.children.length ==0){
                        tree.splice(tree.indexOf(lastAncent),1);
                    }
                }

            };

            /*
             * switch node arrays
             */

            $scope.switchNodeReferences = function(nodeForSwitch, isAdd){
                retrieve(nodeForSwitch, function(node){
                    if(node.children && node.children.length>0) return;
                    if(node.reference){
                        var reference = node.reference;
                        _.each(reference.clones, function(clone){
                            if(isAdd){
                                $scope.switchNode(clone, clone.referencedLeftTree, clone.referencedRightTree);
                            }
                            else{
                                $scope.switchNode(clone, clone.referencedRightTree, clone.referencedLeftTree);
                            }
                        });
                    }else{
                        if(isAdd){
                            $scope.switchNode(node, node.referencedLeftTree, node.referencedRightTree);
                        }
                        else{
                            $scope.switchNode(node, node.referencedRightTree, node.referencedLeftTree);
                        }
                    }
                    return true;
                });
                
                getExistingNodes();
            }

            /*
             * add button trigger
             */
            $scope.addButtonClick = function(){
                $scope.switchNodeReferences($scope.selectedLeftNode, true);
                $scope.selectedLeftNode = null;
            }

            /*
             * remove button trigger
             */
            $scope.removeButtonClick = function(){
                $scope.switchNodeReferences($scope.selectedRightNode, false);
                $scope.selectedRightNode = null;
            }

            
            /*
             * select node from left tree
             */
            $scope.selectLeftNode = function(node, selected, selectedNodes){
                $scope.selectedLeftNode = node;
            };

            /*
             * select node from right tree
             */
            $scope.selectRightNode = function(node){
                $scope.selectedRightNode = node;
            }

            /*
             * get Existing nodes
             */
            function getExistingNodes(){
                var nodes = [];
                _.each($scope.tabs, function(tab){
                    _.each(tab.treeRight, function(parent){
                        retrieve(parent, function(node){
                            if(!node.children || node.children.length == 0){
                                var origin = _.clone(node.reference);
                                if(!_.find(nodes, function(node){ return node[settings.idFieldName] == origin[settings.idFieldName];}))
                                nodes.push(origin);
                                delete origin.clones;
                            }
                        });
                    });
                });
                $scope.selectedNodes = nodes;
                _.each($scope.selectedNodes, function(node, index){
                    $scope.selectedNodes[index] = _.clone(node);
                    delete $scope.selectedNodes[index].ancentIds;
                    delete $scope.selectedNodes[index].container;
                    delete $scope.selectedNodes[index].reference;
                    delete $scope.selectedNodes[index].referencedRightTree;
                    delete $scope.selectedNodes[index].referencedLeftTree;
                });
                

            }

            /*
             * retrieve tree
             */
            function retrieve(node, func){
                if(!node) return;
                if(node.children && node.children.length){
                    for(var i = node.children.length; i >=0; i--){
                        retrieve(node.children[i], func);
                    }
                }
                return func(node);
            }
        }
    }
  }]);