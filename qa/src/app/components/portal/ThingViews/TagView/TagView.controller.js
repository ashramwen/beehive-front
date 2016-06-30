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
  .controller('TagViewController.AddTag',['$rootScope', '$scope', '$uibModalInstance', '$$Tag', function ($rootScope, $scope, $uibModalInstance, $$Tag) {
    $scope.newTag = {things:[]};
    $scope.ok = function () {
        $$Tag.create($scope.newTag, function(tag){
            tag.count = 0;
            tag.displayName = tag.tagName.substr(7);
            tag.createBy = $rootScope.credential.userID;
            $uibModalInstance.close(tag);
        },function(response){
            console.log(response);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  }]);


angular.module('BeehivePortal')
  .controller('TagViewController.EditTag',['$scope', '$uibModalInstance', '$$Tag', '$$Thing', '$timeout', 'tag', '$q', '$$Location', function ($scope, $uibModalInstance, $$Tag, $$Thing, $timeout, tag, $q, $$Location) {

    $scope.tag = tag;
    $scope.existingIDs = [];
    $scope.selectedThings = [];

    $scope.init = function(){
        $$Thing.byTag({tagType: 'Custom', displayName: tag.displayName}, function(things){
            $scope.selectedThings = _.uniq(_.pluck(things,'globalThingID'));
            $scope.existingIDs = _.clone($scope.selectedThings);
        });
    };
    

    $scope.ok = function () {

        /*
         * get things selected
         */
        var thingIDs = $scope.selectedThings;

        $$Tag.update($scope.tag, function(tagName){

            /*
             * get ids of things abondoned
             */
            var idsToDelete = _.difference($scope.existingIDs, thingIDs),
                count = thingIDs.length;

            /*
             * delete old thing id
             */
            var promises = [];
            if(idsToDelete.length>0){
                var p = $$Thing.removeTags({things:idsToDelete.join(','), tags: $scope.tag.displayName}).$promise;
                promises.push(p);
            }
            if(thingIDs.length>0){
                var p = $$Thing.bindTags({things: thingIDs.join(','), tags: $scope.tag.displayName}).$promise;
                promises.push(p);
            }

            $q.all(promises).then(function(){
                $uibModalInstance.close($scope.tag);
            });
            
        },function(response){
            AppUtils.alert(response);
        });

        
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  }]);
