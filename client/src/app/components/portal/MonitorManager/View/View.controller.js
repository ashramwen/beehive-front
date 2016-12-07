'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('ViewController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$User', 'WebSocketClient', function($scope, $rootScope, $state, AppUtils, $$User, WebSocketClient) {
    $scope.init = function() {
        $$User.getUGC({
            type: 'monitor',
            name: 'views'
        }).$promise.then(function(res) {
            $scope.views = res.views;
        });
        /*
{"views":[{"name":"monitor 1","count":5,"id":1469086338314,"desc":"111"},{"name":"monitor 2","count":3,"id":1469156201434,"desc":"222"},{"name":"monitor 3","count":3,"id":1469168460918,"desc":"333"},{"name":"monitor 4","count":0,"id":1469169923794,"desc":"444"},{"name":"monitor 5","count":0,"id":1469169933471,"desc":"5"},{"modifyDate":1470028653169,"name":"monitor 6","count":0,"id":1470028653169,"desc":"666","createDate":1470028653169},{"id":1470032672569,"name":"monitor 7","desc":"7","count":0,"createDate":1470032672569,"modifyDate":1470032672569}]}
*/
    }

    // add new view
    $scope.newView = function() {
        $state.go('^.ViewManager');
    }

    // browse monitoring view
    $scope.monitoring = function(view) {
        $state.go('^.Monitoring', view);
    }

    // delete view
    $scope.delete = function(index, view) {
        var options = {
            msg: 'monitorManager.deleteChannelMsg',
            callback: function() {
                $scope.views.splice(index, 1);
                $$User.setUGC({
                    type: 'monitor',
                    name: 'views'
                }, {
                    views: $scope.views
                });
                $$User.deleteUGC({
                    type: 'monitorView',
                    name: view.id
                });
            }
        }
        AppUtils.confirm(options);
    }

    $scope.mousemove = function(e, v) {
        if (!v.desc) return;
        var x = e.clientX;
        var y = e.clientY;
        var tooltip = document.getElementById('v_' + v.id);
        tooltip.style.top = (y + 20) + 'px';
        tooltip.style.left = (x - 20) + 'px';
    }
}]);