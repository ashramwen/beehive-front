'use strict';

angular.module('BeehivePortal')
  .controller('ThingAuthorityController', ['$scope', '$rootScope', '$state', 'AppUtils', '$timeout', '$$Thing', '$$Tag', '$q', '$$Location', '$User', function($scope, $rootScope, $state, AppUtils, $timeout, $$Thing, $$Tag, $q, $$Location, $User) {
    
    $scope.ownThings = [];
    $scope.selectedThings = [];

    $scope.init = function(){
        var userID = $state.params['userID'];
        $scope.things = $User.getThings({userID: userID});
    };
    

    /*
    $scope.settings = {
        dataset: {},
        idFieldName: 'globalThingID',
        tabs: [
            {
                dataset:[],
                name: '位置',
                mapper: {
                    nameFieldName: 'name',
                    idFieldName: 'id',
                    mapperFieldName: 'location'
                },
                nameGenerator: function(thing){
                    return thing.type + '-' + thing.globalThingID;
                }
            },
            {
                dataset:[],
                name: '种类',
                mapper: {
                    nameFieldName: 'name',
                    idFieldName: 'name',
                    mapperFieldName: 'type'
                },
                nameGenerator: function(thing){
                    return thing.type + '-' + thing.globalThingID;
                }
            },
            {
                dataset:[],
                name: '标签',
                mapper: {
                    nameFieldName: 'displayName',
                    idFieldName: 'displayName',
                    mapperFieldName: 'tags'
                },
                nameGenerator: function(thing){
                    return thing.type + '-' + thing.globalThingID;
                }
            },
            {
                dataset:[],
                name: '全部',
                nameGenerator: function(thing){
                    return thing.type + '-' + thing.globalThingID;
                }
            }
        ]
    }

    var thingsPromise = $$Thing.getAll().$promise;
    $q.all([$$Tag.queryAll().$promise, thingsPromise, $$Location.queryAll().$promise]).then(function(data){
        
        var tags = data[0],
            things = data[1],
            locations = data[2],
            locationRequests = [],
            tagRequests = [],
            locationTree = new LocationTree(_.pluck(locations, 'displayName'));

        _.each(locations, function(location){
            var p = $$Thing.byTag({tagType:'Location', displayName: location.displayName});
            locationRequests.push(p.$promise);
        });

        _.each(tags, function(tag){
            var p = $$Thing.byTag({tagType:'Custom', displayName: tag.displayName});
            tagRequests.push(p.$promise);
        });
        $q.all([$q.all(tagRequests), $q.all(locationRequests)]).then(function(response){
            var tagThingSets = response[0],
                locationThingSets = response[1];

            _.each(tags, function(tag, index){
                _.each(tagThingSets[index], function(tagThing){
                    var thing = _.find(things, function(thing){
                        return tagThing.globalThingID == thing.globalThingID;
                    });
                    if(!_.isArray(thing.tags)){
                        thing.tags = [];
                    }

                    if(thing.tags.indexOf(tag.displayName)<0){
                        thing.tags.push(tag.displayName);
                    }
                });
            })

            _.each(locations, function(location, index){
                _.each(locationThingSets[index], function(locationThing){
                    var thing = _.find(things, function(thing){
                        return locationThing.globalThingID == thing.globalThingID;
                    });
                    if(!_.isArray(thing.location)){
                        thing.location = [];
                    }

                    if(thing.location.indexOf(location.displayName)<0){
                        thing.location.push(location.displayName);
                    }
                });
                
            });
            locations = locationTree.tree.children;

            $scope.settings.existingNodeIDs = _.pluck(data[3], 'globalThingID');
            $scope.settings.dataset.data = things;


            var typesSet = _.uniq(_.pluck(things, 'type'));
            var types = [];
            _.each(typesSet, function(type){
                types.push({
                    name: type
                });
            });

            $scope.settings.tabs[0].dataset = locations;
            $scope.settings.tabs[1].dataset = types;
            $scope.settings.tabs[2].dataset = _.where(tags,{tagType: 'Custom'});
            $scope.settings.tabs[3].dataset = things;

            $scope.ready = true;
        });
    });
    */
   


  }]);
