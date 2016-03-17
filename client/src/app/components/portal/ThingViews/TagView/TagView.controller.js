'use strict';

angular.module('BeehivePortal')
  .controller('TagViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Tag', '$$Thing','$uibModal', '$q', '$http',function($scope, $rootScope, $state, AppUtils, $$Tag, $$Thing, $uibModal, $q, $http) {
    /*
     * define variables
     */
    
    $scope.thingTags = [];
    $scope.tagsForDisplay = [];

    /*
     * init 
     */
    $scope.init = function(){
        if(!$scope.PermissionControl.allowAction('SEARCH_TAGS'))return false;

        $$Tag.queryAll(function(tags){
            $scope.thingTags = tags;
        },function(response){
            console.log(response);
        });
    };

    /*
     * view things under tag
     */
    $scope.viewThings = function(tag){
        $scope.navigateTo($scope.navMapping.TAG_THING_LIST,{id: tag.tagName, from: 'tag', displayName:tag.displayName});
    }


    /*
     * pop modal for creating label
     */
    $scope.addTag = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/ThingViews/TagView/AddTag.template.html',
            controller: 'TagViewController.AddTag',
            size: 'md',
            resolve: {
            }
        });

        modalInstance.result.then(function (tag) {
            $scope.thingTags.push(tag);
        }, function () {
            
        });
    }
    /*
     * show delete modal
     */
    $scope.deleteTag = function(tag){
        AppUtils.confirm('删除标签','是否删除标签' + tag.displayName, function(){
            return $$Tag.remove({},{tagName: tag.displayName}, function(){
                $scope.thingTags.remove(tag);
            });
        });
    };

    /*
     * show edit modal
     */
    
    $scope.editTag = function(tag){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/ThingViews/TagView/EditTag.template.html',
            controller: 'TagViewController.EditTag',
            size: 'lg',
            resolve: {
                tag: tag
            }
        });

        modalInstance.result.then(function (myTag) {
            _.extend(tag,myTag);
        }, function () {
            
        });
    };


  }]);


angular.module('BeehivePortal')
  .controller('TagViewController.AddTag',function ($scope, $uibModalInstance, $$Tag) {
    $scope.newTag = {things:[]};
    $scope.ok = function () {
        $$Tag.create($scope.newTag, function(tag){
            tag.count = 0;
            tag.displayName = tag.tagName;
            $uibModalInstance.close(tag);
        },function(response){
            console.log(response);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  });


angular.module('BeehivePortal')
  .controller('TagViewController.EditTag',['$scope', '$uibModalInstance', '$$Tag', '$$Thing', '$timeout', 'tag', '$q', '$$Location', 'PermissionControl', function ($scope, $uibModalInstance, $$Tag, $$Thing, $timeout, tag, $q, $$Location, PermissionControl) {

    $scope.tag = tag;
    $scope.existingIDs = [];
    $scope.selectedThings = [];

    $scope.init = function(){
        $scope.thingAllowed = PermissionControl.isAllowed('SEARCH_THINGS') && PermissionControl.isAllowed('BING_TAG') && PermissionControl.isAllowed('UNBIND_TAG');
        if($scope.thingAllowed){
            $scope.selectedThings = $$Thing.byTag({tagType: 'Custom', displayName: tag.displayName}, function(things){
                $scope.existingIDs = _.uniq(_.pluck(things,'globalThingID'));
            });
        }
    };
    

    $scope.ok = function () {

        /*
         * get things selected
         */
        var things = $scope.selectedThings;
        
        /*
         * get things IDs from selected things
         */
        var thingIDs = _.uniq(_.pluck(things,'globalThingID'));

        $$Tag.update($scope.tag, function(tagName){
            if($scope.thingAllowed){
                $$Thing.bindTags({things:thingIDs.join(','), tags: $scope.tag.displayName}, function(){
                    
                    /*
                     * get ids of things abondoned
                     */
                    var idsToDelete = _.difference($scope.existingIDs, thingIDs),
                        count = thingIDs.length ;

                    /*
                     * delete old thing id
                     */
                    if(idsToDelete.length>0){
                        $$Thing.removeTags({things:idsToDelete.join(','), tags: $scope.tag.displayName});
                    }

                    $scope.tag.count = count;
                    

                    $uibModalInstance.close($scope.tag);    
                });
            }
        },function(response){
            AppUtils.alert(response);
        });

        
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  }]);
