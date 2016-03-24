'use strict';

angular.module('BeehivePortal')
  .directive('selectPolicy', ['$compile', function($compile){
    return {
        restrict: 'E',
        replace: true,
        scope:{
            policy: '=?',
            thingNumber: '=?'
        },
        templateUrl: 'app/components/portal/TriggerManager/directives/select-policy/select-policy.template.html',
        controller: ['$scope', 'TriggerService', 'AppUtils', function($scope, TriggerService, AppUtils){
            
            $scope.policyOptions = [
                {text: '所有', value: Trigger.PolicyTypeEnum.ALL},
                {text: '任意一个', value: Trigger.PolicyTypeEnum.ANY},
                {text: '指定数量', value: Trigger.PolicyTypeEnum.SOME},
                {text: '指定百分比', value: Trigger.PolicyTypeEnum.PERCENT}
            ];

            $scope.init = function(){
                if(!$scope.policy){
                    $scope.policy = {
                        groupPolicy: $scope.policyOptions[0].value
                    };
                }
            };

        }]
    }
  }]);