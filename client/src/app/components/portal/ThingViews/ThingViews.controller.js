'use strict';

angular.module('BeehivePortal')
  .controller('ThingViewsController', ['$scope', '$rootScope', '$state', 'AppUtils', '$uibModal',function($scope, $rootScope, $state, AppUtils, $uibModal) {
      
    /*
     * create remote control modal
     */
    $scope.openRemoteControl = function(thing){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/ThingViews/RemoteControl.template.html',
            controller: 'ThingViewsController.RemoteControl',
            size: 'md',
            resolve: {
              thing: function () {
                return thing;
              }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log(thing);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
    
    /*
     * context menu setting
     */
    $scope.myMenu = {
        itemList:[
            {
                text: '查看详情',
                callback: function(thing){
                    $scope.navigateTo($scope.navMapping.THING_DETAIL, {thingid: thing.globalThingID});
                }
            },
            {
                text:'编辑',
                callback: function (thing) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/components/portal/ThingViews/EditThing.template.html',
                        controller: 'ThingViewsController.EditThing',
                        size: 'md',
                        resolve: {
                          thing: function () {
                            return thing;
                          }
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        _.extend(thing, selectedItem);
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                }
            },
            {
                text:'删除',
                callback: function (thing) {
                    console.log('Delete thing');
                    console.log(thing);
                }
            }
        ],
        setting:{

        }
    };

  }])
/*
   * remote control modal controller
   */
  .controller('ThingViewsController.RemoteControl',function ($scope, $uibModalInstance, thing, $timeout, TriggerService, $$Thing) {
    
    $scope.init = function(){

        $scope.command = new BeehiveCommand();
        _.extend($scope.command, {thingList:[thing.globalThingID]});

        $scope.thing = thing;
        $scope.sourceSchema = TriggerService.getSchemaByType($scope.thing.type);
    };

    function sendCommand(){
        var schemas = $scope.sourceSchema,
            actions = [];

        _.each(schemas.content.actions, function(action, actionName){
            var actionToAdd = {},
                addFlag = false;
                actionToAdd[actionName] = {};

            if(action._checked){
                _.each(action.in.properties, function(propertyValue, propertyName){
                    if(propertyValue._checked){
                        actionToAdd[actionName][propertyName] = propertyValue.value;
                        addFlag = true;
                    }
                })
            }
            if(addFlag){
                actions.push(actionToAdd);
            }
        });
        $scope.command.command.actions = actions;

        return $$Thing.sendCommand([$scope.command]);
    }
    
    $scope.ok = function () {
        sendCommand().$promise.then(function(){
            $uibModalInstance.close($scope.thing);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  })

  /*
   * edit thing modal controller
   */
  .controller('ThingViewsController.EditThing',function ($scope, $uibModalInstance, thing, $$Thing, $$Tag) {
    $scope.thing = thing;
    _.each($scope.thing.tags,function(tag, index){
        var tmp = tag.split('-');
        tmp.splice(0,1);
        $scope.thing.tags[index] = tmp.join('-');
    });
    var origionTags = _.clone($scope.thing.tags);

    $scope.ok = function () {
        $scope.saveTags();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $$Tag.queryAll(function(tags){
        $scope.queriedTags = _.where(tags, {tagType: 'Custom'});
        console.log(tags);
    },function(response){
        console.log(response);
    });

    /*
     * remove tag
     */
    $scope.removeTag = function(tagName){
        $scope.thing.tags = _.reject($scope.thing.tags, function(tag){
            return tag == tagName;
        });
    }

    $scope.saveTags = function(){
        var selectedTags = _.pluck(_.where($scope.queriedTags ,{_checked: true}), 'tagName'),
            myTags = thing.tags,
            newTags = selectedTags.concat(myTags);

        $$Thing.bindTags({things:$scope.thing.globalThingID, tags: newTags.join(',')}, function(){
                
            /*
             * get ids of things abondoned
             */
            var idsToDelete = _.difference(origionTags, newTags);

            /*
             * delete old thing id
             */
            _.each(idsToDelete, function(id) {
                $$Thing.removeTag({globalThingID:$scope.thing.globalThingID, tagName: id});
            });
            
            $uibModalInstance.close($scope.thing);    
        });
    }
  });