angular.module('BeehivePortal').directive('checkTreeView', ['$templateCache', function($templateCache){
  return {
    scope:{
      settings: '=?',
      treeModel: '=?'
    },
    link: function($scope, $attr, $ele){
      /**
       * 
       */
      var settings = {
        treeModel: '',
        selectedNode: null,
        selectedNodes: null,
        expandedNodes: null,
        onSelection: null,
        onNodeToggle: null,
        orderBy: null,
        reverseOrder: null
      };

      settings.options = {
        multiSelection: true,
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
        },
        templateUrl: 'check-angular-tree.template.html'
      };

      var template =
      '<ul {{options.ulClass}} >' +
      '  <li ng-repeat="node in node.{{options.nodeChildren}} | filter:filterExpression:filterComparator {{options.orderBy}}" ng-class="headClass(node)" {{options.liClass}}' +
      'set-node-to-data>' +
      '    <input type="checkbox" ng-model="selectedClass()!=\'\'" ng-click="selectNodeLabel(node); $event.preventDefault();"/>' +
      '    <i class="tree-branch-head" ng-class="iBranchClass()" ng-click="selectNodeHead(node)"></i>' +
      '    <i class="tree-leaf-head {{options.iLeafClass}}"></i>' +
      '    <div class="tree-label {{options.labelClass}}" ng-class="[selectedClass(), unselectableClass()]" tree-transclude ng-click="selectNodeLabel(node)"></div>' +
      '    <treeitem ng-if="nodeExpanded()"></treeitem>' +
      '  </li>' +
      '</ul>';

      $templateCache.put('check-angular-tree.template.html', template);
      

    }

  }
}])