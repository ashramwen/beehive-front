'use strict';

angular.module('BeehivePortal.MonitorManager')

.controller('MonitoringController', ['$scope', '$rootScope', '$state', '$stateParams', '$location', '$$User', 'WebSocketClient', function($scope, $rootScope, $state, $stateParams, $location, $$User, WebSocketClient) {
    if ($stateParams.id === 0) {
        $state.go('^');
    }

    // get monitoring view
    $scope.view = $stateParams;

    // get monitoring view detail
    // $$User.getCustomData({ name: 'mv_' + $scope.view.id }).$promise.then(function(res) {
    // $scope.view = res.view || {};
    // websocketInit();

    $scope.view = { "id": 1470032672569, "name": "monitor 7", "desc": "7", "count": 0, "createDate": 1470032672569, "modifyDate": 1470032672569, "detail": [{ "modifyBy": "493e83c9", "vendorThingID": "0807W-F02-03-118", "kiiThingID": "th.f83120e36100-bada-6e11-81f4-0a4538a6", "select": false, "modifyDate": 1469116800000, "type": "Lighting", "tags": [], "kiiAppID": "493e83c9", "fullKiiThingID": "493e83c9-th.f83120e36100-bada-6e11-81f4-0a4538a6", "createBy": "f1dadad0-4834-11e6-9c73-00163e007aba", "globalThingID": 1090, "createDate": 1469030400000, "status": { "taiwanNo1": 1469168587000, "Power": 0, "target": "th.f83120e36100-bada-6e11-81f4-0a4538a6" } }, { "modifyBy": "493e83c9", "vendorThingID": "0807W-F02-15-118", "kiiThingID": "th.aba700e36100-72a9-6e11-81f4-0b7146b6", "select": false, "modifyDate": 1469116800000, "type": "Lighting", "tags": [], "kiiAppID": "493e83c9", "fullKiiThingID": "493e83c9-th.aba700e36100-72a9-6e11-81f4-0b7146b6", "createBy": "f1dadad0-4834-11e6-9c73-00163e007aba", "globalThingID": 1091, "createDate": 1469030400000, "status": { "taiwanNo1": 1469168580000, "Bri": 284, "target": "th.aba700e36100-72a9-6e11-81f4-0b7146b6" } }, { "modifyBy": "493e83c9", "vendorThingID": "0807W-F02-03-117", "kiiThingID": "th.aba700e36100-72a9-6e11-81f4-071aaac6", "select": false, "modifyDate": 1469116800000, "type": "Lighting", "tags": [], "kiiAppID": "493e83c9", "fullKiiThingID": "493e83c9-th.aba700e36100-72a9-6e11-81f4-071aaac6", "createBy": "f1dadad0-4834-11e6-9c73-00163e007aba", "globalThingID": 1093, "createDate": 1469030400000, "status": { "SetBri": 0, "Turntimes": 0, "taiwanNo1": 1469168581000, "State": 0, "Alarm": 0, "Bri": 0, "Runtimes": 0, "Power": 0, "target": "th.aba700e36100-72a9-6e11-81f4-071aaac6" } }, { "createDate": 1469721600000, "modifyDate": 1470067200000, "createBy": "640", "modifyBy": "2", "vendorThingID": "0807W-F02-15-220", "kiiAppID": "192b49ce", "type": "Sensor", "status": { "taiwanNo1": 1470121795000, "Bri": 256, "target": "th.aba700e36100-72a9-6e11-1c75-0870ee47" }, "fullKiiThingID": "192b49ce-th.aba700e36100-72a9-6e11-1c75-0870ee47", "schemaName": "Sensor", "schemaVersion": "1", "kiiThingID": "th.aba700e36100-72a9-6e11-1c75-0870ee47", "tags": [], "globalThingID": 1136 }] };

    setTimeout(function() { websocketInit(); }, 1000);
    // })

    // websocket connection
    function websocketInit() {
        var i = 0;
        for (; i < $scope.view.detail.length; i++) {
            subscription($scope.view.detail[i]);
        }

        WebSocketClient.subscribe('/topic/192b49ce/th.aba700e36100-72a9-6e11-4785-0b1ad90b', function(res) {

        });
    }

    // thing subscription
    function subscription(thing) {
        WebSocketClient.subscribe('/topic/' + thing.kiiAppID + '/' + thing.kiiThingID, function(res) {
            thing.state = parseState(JSON.parse(res.body));
        });
    }

    // parse the data from websocket
    function parseState(state) {
        var ret = [];
        for (var k in state.state) {
            ret.push({
                'name': k,
                'value': state.state[k]
            })
        }
        return ret;
    }

    // modify view
    $scope.modify = function() {
        $state.go('^.ViewManager', $scope.view);
    }

    // go back
    $scope.fallback = function() {
        $state.go('^');
    }

    // leave page
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.name !== 'app.portal.MonitorManager.Monitoring') {
            WebSocketClient.unsubscribeAll();
        }
    })
}]);