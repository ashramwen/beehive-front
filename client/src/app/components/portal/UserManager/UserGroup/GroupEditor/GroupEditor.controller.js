'use strict';

angular.module('BeehivePortal')
  .controller('GroupEditorController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$UserGroup', '$$User', '$$Tag', '$$Permission', '$q', '$location', '$$Thing',
    function($scope, $rootScope, $state, AppUtils, $$UserGroup, $$User, $$Tag, $$Permission, $q, $location, $$Thing) {

    $scope.dataset = {};
    $scope.group = {};
    $scope.isOwner = false;

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
            text: "用户ID",
            value: "userID"
        },
        {
            text: "用户姓名",
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
            AppUtils.alert('Failed to load group user list!');
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
                $scope.group.things = $$UserGroup.getThings({}, {userGroupID: userGroupID});
                $scope.isOwner = $scope.isCreator(group);
            });

            // get user
            $scope.queryUsers();

            // get tags
            $scope.tags = $$Tag.queryAll();
        });
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

    $scope.addTag = function(tag, group){
        $$UserGroup.bindTag({tags: [tag.fullTagName], userGroupIDs:[group.userGroupID]}, function(){
            $scope.group.tags = $scope.group.tags || [];
            $scope.group.tags.push(tag);
        });
    }

    $scope.removeTag = function(tag, group){
        $$UserGroup.unbindTag({tags: [tag.fullTagName], userGroupIDs:[group.userGroupID]}, function(){
            $scope.group.tags.remove(tag);
        });
    };

    $scope.addThings = function(globalThingIDs, group){
        $$UserGroup.bindThing({}, {globalThingIDs: [globalThingIDs], userGroupIDs: [group.userGroupID]}, function(things){
            $scope.group.things = $scope.group.things || [];
            _.each(globalThingIDs, function(globalThingID){
                $scope.group.things.push($$Thing.get({globalThingID: globalThingID}));
            });
        });
    };

    $scope.removeThing = function(thing, group){
        $$UserGroup.unbindThing({globalThingIDs: [thing.globalThingID], userGroupIDs: [group.userGroupID]}, function(){
            $scope.group.things.remove(thing);
        });
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
        var users = _.pluck($scope.group._users,'userID');
        $scope.group.users = users;

        $$UserGroup.update({}, $scope.group, function (response){
            $scope.navigateTo($scope.navMapping.USER_GROUP);
        });
    };


  }]);
