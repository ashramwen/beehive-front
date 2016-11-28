'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('ViewManagerController', ['$scope', '$rootScope', '$state', '$stateParams', 'AppUtils', '$$User', '$q', function($scope, $rootScope, $state, $stateParams, AppUtils, $$User, $q) {
    var viewIndex = -1;

    // the specific view
    $scope.view = $stateParams;

    // $$User.getThings().$promise.then(function(res) {
    //     $scope.things = res;
    // });

    $scope.init = function() {
        // get monitoring views
        var q1 = $$User.getUGC({
            type: 'monitor',
            name: 'views'
        }).$promise;

        var promises = [q1];
        if ($stateParams.id !== 0) {
            promises.push($$User.getUGC({
                type: 'monitorView',
                name: $stateParams.id
            }).$promise);
        }

        $q.all(promises).then(function(res) {
            $scope.views = res[0].views || [];

            if (res.length > 1) {
                $scope.view = res[1].view;
                viewIndex = _.findIndex($scope.views, function(view) {
                    return view.id === $scope.view.id;
                })
            }
        }, function(res) {
            if (res.data.errorCode === 'OBJECT_NOT_FOUND')
                $scope.views = [];
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
        view.detail.forEach(function(o) {
            delete o.select;
        });
        return angular.extend(view, {
            count: view.detail.length,
            createDate: _date,
            modifyDate: _date
        });
    }

    // save monitor view
    function saveMonitorView(title, msg) {
        var q1 = $$User.setUGC({
            type: 'monitor',
            name: 'views'
        }, {
            views: $scope.views
        }).$promise;

        var q2 = $$User.setUGC({
            type: 'monitorView',
            name: $scope.view.id
        }, { view: $scope.view }).$promise;

        $q.all([q1, q2]).then(function(res) {
            var options = {
                msg: msg,
                title: title,
                callback: $scope.goBack
            }

            AppUtils.alert(options);
        });
    }

    /**
     * 返回
     */
    $scope.goBack = function() {
        if ($scope.view.id === 0) {
            $state.go($state.current.previous);
        } else {
            $state.go('^.Monitoring', $scope.view);
        }
    }
}]);