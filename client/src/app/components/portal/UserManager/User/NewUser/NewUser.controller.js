'use strict';

angular.module('BeehivePortal')
  .controller('NewUserController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$UserManager', 'PortalService',function($scope, $rootScope, $state, AppUtils, $$UserManager, PortalService) {
    // TODO
    $scope.sexOptions = [{
        value: 1,
        text:'男'
    },{
        value: 2,
        text: '女'
    }];

    $scope.ruleOptions = [
        {
          value: 'commUser',
          text: '普通用户'
        },
        {
          value: 'userAdmin',
          text: '用户管理员'
        },
        {
          value: 'administrator',
          text: '系统管理员'
        }
    ];

    /*
     * user object for registration.
     */
    $scope.newUser = {
        userName: '', // required
        phone: '',
        mail: '',
        role: '4', // required
        roleName: ''
    };

    /*
     * init data
     */
    
    $scope.init = function(){
      
    };

    /*
     * create user
     */
    $scope.createUser = function(){
        $$UserManager.create($scope.newUser, function(userRegistrationInfo){
            var userID = userRegistrationInfo.userID;
            var activityToken = userRegistrationInfo.activityToken;

            AppUtils.alert('新创建的用户ID为：' + userID + ',激活码为：' + activityToken + '。请前往登录页面进行激活。');
            
            $scope.navigateTo($scope.navMapping.USER_LIST);
        },function(response){
            if(response.status == 409)
            console.log(response);
            AppUtils.alert('User ID exists!');
        });
    }
  }]);
