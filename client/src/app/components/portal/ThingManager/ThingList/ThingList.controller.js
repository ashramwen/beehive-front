'use strict';

angular.module('BeehivePortal')
  .controller('ThingListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$location', 'ThingManagerService',function($scope, $rootScope, $state, AppUtils, $location, ThingManagerService) {
    $scope.things = [];
    /*
     * page setting
     */
    $location.search(_.extend($scope.$state.params,{'pageIndex': 1}));
    $scope.currentIndex = 1;

    $scope.pageChanged = function(){
        $location.search({'pageIndex': $scope.currentIndex});
    }

    /*
     * Init app
     */
    $scope.init = function(){

        ThingManagerService.getThings().then(function(response){
            $scope.things = response.data;
        },function(){

        });
    };

  }]);
