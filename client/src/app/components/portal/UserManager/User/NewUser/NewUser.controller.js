'use strict';

angular.module('BeehivePortal')
  .controller('NewUserController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', 'PortalService',function($scope, $rootScope, $state, AppUtils, $$User, PortalService) {
    // TODO
    $scope.sexOptions = [{
        id: 1,
        text:'男'
    },{
        id: 2,
        text: '女'
    }];

    /*
     * user object for registration.
     */
    $scope.newUser = {
        userID: '',
        userName: '', // required
        phone: '',
        mail: '',
        company: '',
        role: '4', // required
        custom: {
          sex: {},
          id: "",
          building: null,
          level: null,
          room: null
        }
    }

    /*
     * init data
     */
    
    $scope.init = function(){
        
    };

    /*
     * create user
     */
    $scope.createUser = function(){
        $$User.create($scope.newUser, function(){
            $scope.navigateTo($scope.navMapping.USER_LIST);
        },function(response){
            if(response.status == 409)
            console.log(response);
            AppUtils.alert('User ID exists!');
        });
    }
  }]);
