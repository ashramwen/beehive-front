'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('ViewManagerController', ['$scope', '$rootScope', '$state', '$stateParams', 'AppUtils', '$$User', function($scope, $rootScope, $state, $stateParams, AppUtils, $$User) {
    var viewIndex = -1;

    // the specific view
    $scope.view = $stateParams;

    $$User.getThings().$promise.then(function(res) {
        $scope.things = res;
    });

    // get monitoring views
    $$User.getCustomData({ name: 'monitorViews' }).$promise.then(function(res) {
        $scope.views = res.views || [];

        // find index of the specific view in the views
        if ($scope.view.id !== 0) {
            viewIndex = _.indexOf($scope.views, $scope.view)
        }
    });

    /**
     * 新增頻道
     */
    $scope.newView = function() {
        if (!$scope.view.name) return;
        $scope.view.id = new Date().getTime();
        $scope.views.push($scope.view);
        $$User.setCustomData({ name: 'monitorViews' }, {
            views: $scope.views
        }).$promise.then(function(res) {
            AppUtils.alert('创建成功！', '频道创建成功！', $scope.fallback);
        });
    }

    /**
     * 保存提交
     */
    $scope.modifyView = function() {
        if (!$scope.view.name) return;
        $scope.view.id = new Date().getTime();
        $scope.views[viewIndex] = angular.copy($scope.view);
        $$User.setCustomData({ name: 'monitorViews' }, {
            views: $scope.views
        }).$promise.then(function(res) {
            AppUtils.alert('提交成功！', '编辑内容提交成功！', $scope.fallback);
        });
    }

    /**
     * 返回
     */
    $scope.fallback = function() {
        $state.go($state.current.previous);
    }
}]);
