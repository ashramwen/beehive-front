'use strict';

angular.module('BeehivePortal')
  .controller('AddThingController', ['$scope', '$rootScope', '$state', 'AppUtils', '$$Thing', '$$Type', '$timeout', function($scope, $rootScope, $state, AppUtils, $$Thing, $$Type, $timeout) {
    $scope.types = [];
    var editor;

    $scope.init = function(){
        $scope.types = $$Type.getAll();
        $scope.thing = new BeehiveThing();
        $timeout(function(){
            var container = document.getElementById("jsoneditor");
            var options = {mode: 'code'};
            editor = new JSONEditor(container, options);
        },50);
    };

    $scope.saveThing = function(thing){
        var customFields = editor.get();
        if(customFields){
            thing.custom = customFields;
        }

        $$Thing.save(thing, function(){
            AppUtils.alert('保存成功！', '提示信息');
        });
    };

  }]);