'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('ViewManagerController', ['$scope', '$rootScope', '$state', '$stateParams', 'AppUtils', '$$User', '$q', function($scope, $rootScope, $state, $stateParams, AppUtils, $$User, $q) {
    var viewIndex = -1;

    // the specific view
    $scope.view = $stateParams;

    $$User.getThings().$promise.then(function(res) {
        $scope.things = res;
    });

    $scope.init = function() {
        // get monitoring views
        var q1 = $$User.getCustomData({ name: 'monitorViews' }).$promise;

        var promises = [q1];
        if ($stateParams.id !== 0) {
            promises.push($$User.getCustomData({ name: 'mv_' + $stateParams.id }).$promise);
        }

        $q.all(promises).then(function(res) {
            $scope.views = res[0].views || [];

            if (res.length > 1) {
                $scope.view = res[1].view;
                viewIndex = _.findIndex($scope.views, function(view) {
                    return view.id === $scope.view.id;
                })
            }
        });
    }

    /**
     * 新增頻道
     */
    $scope.newView = function() {
        if (!$scope.view.name) return;
        preprocessView($scope.view);
        var temp = angular.copy($scope.view);
        delete temp.detail;
        $scope.views.push(temp);
        saveMonitorView('创建成功！', '频道创建成功！');
    }

    /**
     * 保存提交
     */
    $scope.modifyView = function() {
        if (!$scope.view.name) return;
        preprocessView($scope.view);
        $scope.views[viewIndex] = angular.copy($scope.view);
        delete $scope.views[viewIndex].detail;
        saveMonitorView('提交成功！', '编辑内容提交成功！');
    }

    // preprocess view before save
    function preprocessView(view) {
        var _date = new Date().getTime();
        if (!view.id) view.id = _date;
        return angular.extend(view, {
            count: view.detail.length,
            createDate: _date,
            modifyDate: _date
        });
    }

    // save monitor view
    function saveMonitorView(title, msg) {
        var q1 = $$User.setCustomData({ name: 'monitorViews' }, {
            views: $scope.views
        }).$promise;

        var q2 = $$User.setCustomData({ name: 'mv_' + $scope.view.id }, { view: $scope.view }).$promise;

        $q.all([q1, q2]).then(function(res) {
            AppUtils.alert(msg, title, $scope.fallback);
        });
    }

    /**
     * 返回
     */
    $scope.fallback = function() {
        if ($scope.view.id === 0) {
            $state.go($state.current.previous);
        } else {
            $state.go('^.Monitoring', $scope.view);
        }
    }
}]);