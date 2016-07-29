'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('ViewManagerController', ['$scope', '$rootScope', '$state', '$stateParams', 'AppUtils', '$$User', '$q', function($scope, $rootScope, $state, $stateParams, AppUtils, $$User, $q) {
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
            viewIndex = _.findIndex($scope.views, function(view) {
                return view.id === $scope.view.id;
            })
        }
    });

    /**
     * 新增頻道
     */
    $scope.newView = function() {
        if (!$scope.view.name) return;
        $scope.view.id = new Date().getTime();
        $scope.view.count = $scope.view.detail.length;
        $scope.view.createDate = new Date().getTime();
        $scope.views.push($scope.view);
        saveMonitorView('创建成功！', '频道创建成功！');
    }

    /**
     * 保存提交
     */
    $scope.modifyView = function() {
        if (!$scope.view.name) return;
        $scope.view.count = $scope.view.detail.length;
        $scope.view.modifyDate = new Date().getTime();
        $scope.views[viewIndex] = $scope.view;
        saveMonitorView('提交成功！', '编辑内容提交成功！');
    }

    // save monitor view
    function saveMonitorView(title, msg) {
        var _detail = angular.copy($scope.view.detail);
        delete $scope.view.detail;

        var q1 = $$User.setCustomData({ name: 'monitorViews' }, {
            views: $scope.views
        }).$promise;

        var q2 = $$User.setCustomData({ name: 'mv_' + $scope.view.id }, {
            detail: _detail
        }).$promise;

        // var q2 = $$User.setCustomData({ name: 'mv_' + $scope.view.id }, {
        //     detail: [{
        //         "createDate": 1468425600000,
        //         "modifyDate": 1468425600000,
        //         "createBy": "f1dadad0-4834-11e6-9c73-00163e007aba",
        //         "modifyBy": "493e83c9",
        //         "vendorThingID": "gatewayhi3",
        //         "kiiAppID": "493e83c9",
        //         "type": "gateway-streetlight",
        //         "status": {},
        //         "fullKiiThingID": "493e83c9-th.f83120e36100-bada-6e11-d894-0855bd7b",
        //         "kiiThingID": "th.f83120e36100-bada-6e11-d894-0855bd7b",
        //         "custom": {},
        //         "globalThingID": 1068,
        //         "tags": [],
        //         "select": false
        //     }, {
        //         "createDate": 1469030400000,
        //         "modifyDate": 1469116800000,
        //         "createBy": "f1dadad0-4834-11e6-9c73-00163e007aba",
        //         "modifyBy": "493e83c9",
        //         "vendorThingID": "0807W-F02-03-118",
        //         "kiiAppID": "493e83c9",
        //         "type": "Lighting",
        //         "status": { "taiwanNo1": 1469156445000, "Power": 0, "target": "th.f83120e36100-bada-6e11-81f4-0a4538a6" },
        //         "fullKiiThingID": "493e83c9-th.f83120e36100-bada-6e11-81f4-0a4538a6",
        //         "kiiThingID": "th.f83120e36100-bada-6e11-81f4-0a4538a6",
        //         "globalThingID": 1090,
        //         "tags": [],
        //         "select": false
        //     }]
        // }).$promise;

        $q.all(q1, q2).then(function(res) {
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