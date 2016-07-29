'use strict';

angular.module('BeehivePortal')
  .controller('UserGroupListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$uibModal', '$$UserGroup', '$location', '$http', function($scope, $rootScope, $state, AppUtils, $uibModal, $$UserGroup, $location, $http) {
    
    $scope.dataset = {};
    $scope.dataset.userGroups = [];
    $scope.dataset.userGroupsForDisplay = [];

    $scope.init = function(){
        $rootScope.$watch('login', function(newVal){
            if(!newVal) return;
            $scope.groupType = $scope.groupTypes[0];
            $scope.groupTypes.splice(1, 1);
            
            $scope.$watch('groupType', function(newVal, oldVal){
                if($scope.groupType.value == 'mygroup'){
                    $scope.dataset.userGroups = $$UserGroup.getMyGroups();
                }else{
                    $scope.dataset.userGroups = $$UserGroup.getList();
                }
            });
        });
    };


    /**
     * group type options and field
     */
    $scope.groupTypes = [
        {
            text: '我的群组',
            value: 'mygroup'
        },
        {
            text: '所有群组',
            value: 'allgroup'
        }
    ];
    $scope.groupType = null;

    /*
     * search options and filed
     */
    $scope.searchValue = "";
    $scope.queryOptions = [
        {
            text: "群组名称",
            value: "userGroupName"
        }
    ];

    /*
     * search group by option
     */
    $scope.queryUserGroups = function(queryFiled, value){

        var request = {};
        if(value) {
            request[queryFiled] = value;
            request.includeUserData = '0';
            $scope.dataset.userGroups = $$UserGroup.query({}, request);
        }else{
            $scope.dataset.userGroups = $$UserGroup.getList();
        }
        
        
    }


    /*
     * pop up new user group modal
     */
    $scope.createGroup = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/components/portal/UserManager/UserGroup/UserGroupList/NewUserGroup.template.html',
            controller: 'UserGroupListController.NewUserGroup',
            size: 'md',
            resolve: {
            }
        });

        modalInstance.result.then(function (newGroup) {
            console.log(newGroup);
            $scope.dataset.userGroups.push(newGroup);
        }, function () {
            
        });
    }

    $scope.goUserList = function(group){
        console.log(group);
        $scope.navigateTo($scope.navMapping.GROUP_USER_LIST, {userGroupID: group.userGroupID});
    };

    $scope.goThingAuth = function(group){
        $scope.navigateTo($scope.navMapping.GROUP_THING_AUTH, {userGroupID: group.userGroupID});
    };

    $scope.goEdit = function(group){
        $scope.navigateTo($scope.navMapping.USER_GROUP_EDITOR, {userGroupID: group.userGroupID});
    };

    $scope.deleteGroup = function(group){
        AppUtils.confirm('删除用户群组','确定要删除用户群组['+ group.userGroupName +']吗?',function(){
            $$UserGroup.remove({},group, function(){
                $scope.dataset.userGroups = _.reject($scope.dataset.userGroups, function(userGroup){
                    return userGroup == group;
                });
            });
        });
    }
  }]);


angular.module('BeehivePortal')
  .controller('UserGroupListController.NewUserGroup',function ($scope, $uibModalInstance, $$UserGroup, AppUtils) {
    
    $scope.newGroup = {
        userGroupName: "",
        description: ""
    };

    $scope.ok = function () {
        $$UserGroup.create({}, $scope.newGroup, function(response){
            $scope.newGroup.userGroupID = response.userGroupID;
            $uibModalInstance.close($scope.newGroup);
        }, function(response){
            AppUtils.alert("新增群组失败！")
        })
        
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  });
