'use strict';

angular.module('BeehivePortal')
  .controller('GroupEditorController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$UserGroup', '$$User', '$$Tag', '$$Permission', '$q', '$location',
    function($scope, $rootScope, $state, AppUtils, $$UserGroup, $$User, $$Tag, $$Permission, $q, $location) {
    
    $scope.group = {};

    /*
     * userList caches data of different pages,
     * while userListForDisplay caches only one-page data
     */
    $scope.userList = [];
    $scope.userListForDisplay = [];

    /*
     * page settings
     */
    
    $scope.currentIndex = 1;

    $scope.pageChanged = function(){
        $location.search({'pageIndex': $scope.currentIndex});
        findUsersForDisplay();
    }

    function findUsersForDisplay(){
        $scope.userListForDisplay = _.filter($scope.userList, function(user, index){
            return index >= ($scope.currentIndex - 1) * $scope.listMaxLength 
                    && index < $scope.currentIndex * $scope.listMaxLength;
        });
    }
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
            text: "用户名称",
            value: "userName"
        }
    ];
    $scope.queryFiled = _.clone($scope.queryOptions[0]);

    /*
     * search users by option
     */
    $scope.queryUsers = function(queryFiled, value){

        var request = {role:'4'};
        if(value) request[queryFiled] = value;

        $$User.query(request,function(userList){
            console.log(userList);
            $scope.userList = userList;
            $scope.pageChanged();
        },function(){
            AppUtils.alert('Failed to load group user list!');
        });
    };

    $scope.init = function(){
        
        var userGroupID = $state.params['userGroupID'];
        var request = {userGroupID: userGroupID, includeUserData: '1'};

        if(!$scope.PermissionControl.allowAction('GET_GROUP')) return;

        // get group
        $scope.group = $$UserGroup.get({} ,request , function(group){
            $scope.group._users = _.clone($scope.group.users);
        });
        
        // get user
        if($scope.PermissionControl.isAllowed('ADD_GROUP_MEMBER') 
                && $scope.PermissionControl.isAllowed('SEARCH_USERS')){
            
            $scope.queryUsers();
        }

        // get tags
        $scope.tags = $$Tag.queryAll();

        // get permission list
        if($scope.PermissionControl.isAllowed('GET_GROUP_PERMISSIONS')){
            $scope.groupPermission = $$Permission.byGroup({userGroupID: userGroupID});
            if($scope.PermissionControl.isAllowed('GET_ALL_PERMISSIONS')){
                $scope.permissionList = $$Permission.getList();
                $q.all([$scope.permissionList.$promise, $scope.groupPermission.$promise]).then(function(data){
                    /*
                     * remove existing permissions
                     */
                    _.each($scope.groupPermission, function (myPermission) {
                        $scope.permissionList = _.reject($scope.permissionList, function(permission){
                            return permission.id == myPermission.id;
                        });
                    });
                });
            }
        }
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


    $scope.bindPermission = function (permission, userGroup){
        var params = {permissionID:permission.id, userGroupID: userGroup.userGroupID };
        var callback = function(){
            var permissionClone = _.clone(permission);

            $scope.groupPermission.push(permissionClone);
            $scope.permissionList.remove(permission);
        };

        $$Permission.bindGroup(params,callback);
    };

    $scope.unbindPermission = function (permission, userGroup) {
        var params, callback;
        params = {permissionID:permission.id, userGroupID: userGroup.userGroupID };
        callback = function (){
            var permissionClone = _.clone(permission);

            $scope.groupPermission.remove(permission);
            $scope.permissionList.push(permissionClone);
        };

        $$Permission.unbindGroup(params, callback);
    };


    
  }]);
