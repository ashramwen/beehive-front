'use strict';

angular.module('BeehivePortal')
  .controller('UserListController', ['$scope', '$rootScope', '$state', 'AppUtils', '$uibModal', '$log', '$location', '$$User',function($scope, $rootScope, $state, AppUtils, $uibModal, $log, $location, $$User) {
    /*
     * userList caches data of different pages,
     * while userListForDisplay caches only one-page data
     */
    $scope.userList = [];
    $scope.userListForDisplay = [];

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

    $scope.myMenu = {
        itemList:[
            {
                text: '查看详情',
                callback: function(user) {
                    $scope.navigateTo($scope.navMapping.USER_INFO,{userID: user.userID});
                },
                hidden: !$scope.PermissionControl.isAllowed('GET_USER')
            },
            {
                text:'编辑',
                callback: function (user) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/components/portal/UserManager/User/EditUser.template.html',
                        controller: 'UserController.EditUser',
                        size: 'md',
                        resolve: {
                          user: function () {
                            return user;
                          }
                        }
                    });

                    modalInstance.result.then(function (updatedUser) {
                        _.extend(user,updatedUser);
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                },
                hidden: !$scope.PermissionControl.isAllowed('GET_USER')
            },{
                text:'删除',
                callback: function (user) {
                    $$User.remove({},user,function(){
                        console.log('用户' + user.userName + '已被删除！');
                        $scope.userList.remove(user);
                        findUsersForDisplay();
                    },function(){
                        console.log('未能删除用户:' + user.userName)
                    });
                },
                hidden: !$scope.PermissionControl.isAllowed('DELETE_USER')
            }
        ],
        setting:{

        }
    };

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
         /*
         * page settings
         */
        $location.search({'pageIndex': 1});
        $scope.currentIndex = 1;

        if($scope.PermissionControl.allowAction('SEARCH_USERS')){
            $scope.queryUsers();
        }
    };

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
    

  }]).
  controller('UserListController.ActivateUser', function($scope, user, $$User, $uibModalInstance){
    $scope.user = user;
    $scope.register = function () {
        $$User.register({}, $scope.user, function(){
            AppUtils.alert('注册成功！请使用用户名登陆！');
            $uibModalInstance.close();
        }, function(credentials, erro){
            AppUtils.alert(erro);
        });
    };

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    }
  });

