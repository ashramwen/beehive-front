'use strict';

angular.module('BeehivePortal')
  .controller('ThingListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$location', '$$Thing',function($scope, $rootScope, $state, AppUtils, $location, $$Thing) {
    
    $scope.things = [];
    $scope.thingsForDisplay = [];
    

    /*
     * query all things
     */
    $scope.queryThings = function(from, id){
        if(from == 'type'){
            $scope.things = $$Thing.byType({}, {typeName: id});
        }else{
            $scope.things = $$Thing.byTag({tagType:'Custom',displayName:id});
        }
    }

    /*
     * Init app
     */
    $scope.init = function(){

        var from = $state.params['from'],
            id = $state.params['id'],
            navObj = null;

        switch(from){
          case 'type':
            navObj = $scope.navMapping.TYPE_THING_DETAIL;
            id = $state.params['typeName'];
            break;
          case 'tag':
            navObj = $scope.navMapping.TAG_THING_DETAIL;
            id = $state.params['displayName'];
            break;
        }

        $scope.queryThings(from, id);

        var showDetailItem =_.find($scope.myMenu.itemList,function(item){
          return item.text == '查看详情';
        });
        _.extend(showDetailItem,{callback:function(thing){
            $scope.navigateTo(navObj,_.extend({thingid: thing.globalThingID},$state.params));
        }});
    };

  }]);
