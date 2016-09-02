'use strict';

angular.module('BeehivePortal')
  .controller('GroupEditorController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$UserGroup', '$$User', '$$Tag', '$$Permission', '$q', '$location', '$$Thing', 'TriggerDetailService',
    function($scope, $rootScope, $state, AppUtils, $$UserGroup, $$User, $$Tag, $$Permission, $q, $location, $$Thing, TriggerDetailService) {

    $scope.dataset = {};
    $scope.group = {};
    $scope.isOwner = false;
    $scope.inputMethods = {};

    /*
     * userList caches data of different pages,
     * while userListForDisplay caches only one-page data
     */
    $scope.dataset.userList = [];
    $scope.dataset.userListForDisplay = [];

    /*
     * search options and filed
     */
    $scope.searchValue = "";
    $scope.queryOptions = [
        {
            text: "user.loginName",
            value: "userName"
        },
        {
            text: "user.userName",
            value: "displayName"
        }
    ];
    $scope.queryFiled = _.clone($scope.queryOptions[0]);

    /*
     * search users by option
     */
    $scope.queryUsers = function(queryFiled, value){

        var request = {};
        if(value) request[queryFiled] = value;

        $$User.query(request, function(userList){
            $scope.userList = userList;
        },function(){
            AppUtils.alert({msg: 'Failed to load group user list!'});
        });
    };

    $scope.init = function(){
        $rootScope.$watch('login', function(newVal){
            if(!newVal) return;
            var userGroupID = $state.params['userGroupID'];
            var request = {userGroupID: userGroupID, includeUserData: '1'};

            // get group
            $scope.group = $$UserGroup.get({} ,request , function(group){
                $scope.group._users = _.clone($scope.group.users);
                $scope.group.tags = $$UserGroup.getTags({}, {userGroupID: userGroupID});

                $$UserGroup.getThings({}, {userGroupID: userGroupID}, function(things){
                    $scope.selectedThings = _.pluck(things, 'globalThingID');
                    TriggerDetailService.getThingsDetail(things).then(function(things){
                        $scope.selectedThings = _.pluck(things, 'globalThingID');
                        $scope.inputMethods.inputThingDataset({selectedThings: things});
                    });
                });

                $scope.isOwner = $scope.isCreator(group);
            });

            // get user
            $scope.queryUsers();

            // get tags
            $scope.tags = $$Tag.queryAll();
        });
    };

    $scope.selectedChange = function(selectedThings, type){
        $scope.things = _.pluck(selectedThings, 'globalThingID');
    };

    /*
     * remove user from group
     */
    $scope.removeUser = function(user, group){

        $$UserGroup.deleteUser({},
                {userID: user.userID, userGroupID: group.userGroupID}, function(){
            $scope.group._users = _.reject(group._users, function(groupUser){
                return user == groupUser;
            });
        });
    };

    $scope.addThings = function(globalThingIDs, group){
        $$UserGroup.bindThing({}, {globalThingIDs: [globalThingIDs], userGroupIDs: [group.userGroupID]});
    };

    $scope.removeThings = function(globalThingIDs, group){
        $$UserGroup.unbindThing({globalThingIDs: globalThingIDs, userGroupIDs: [group.userGroupID]});
    };

    $scope.addUser = function(user, group){

        $$UserGroup.addUser({userID: user.userID, userGroupID: group.userGroupID},function(){
            $scope.group._users = $scope.group._users || [];
            if(!_.find($scope.group._users, function(myUser){return user.userID == myUser.userID;})){
                $scope.group._users.push(user);
            }
        });
    };

    $scope.saveGroup = function(){
        var users = _.pluck($scope.group._users,'id');
        $scope.group.users = $scope.group._users;
        delete $scope.group._users;
        delete $scope.group.tags;

        var group = {
            userGroupID: $scope.group.userGroupID,
            userGroupName: $scope.group.userGroupName,
            description: $scope.group.description
        };

        $$UserGroup.update({}, group, function (response){
            var thingsToDelete = _.difference($scope.selectedThings, $scope.things);
            var thingsToAdd = _.difference($scope.things, $scope.selectedThings);

            if(thingsToAdd.length){
                $scope.addThings(thingsToAdd, $scope.group);
            }
            if(thingsToDelete.length){
                $scope.removeThings(thingsToDelete, $scope.group);
            }
            $scope.navigateTo($scope.navMapping.USER_GROUP);
        });
    };


  }]);
