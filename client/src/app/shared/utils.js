angular.module('BeehivePortal')
    .factory('AppUtils', ['$http', '$location', '$q', '$state', '$timeout', '$rootScope', '$uibModal',
    function ($http, $location, $q, $state, $timeout, $rootScope, $uibModal) {
        window.app = {};
        var requestCount = 0;
        app.utils = {
            initialize: function(){
                this._initialize();
            },
            _initialize: function(){
                this._IEPlaceholder();

                /**
                  * extend capitalize and lower first letter function for String
                  **/
                String.prototype.capitalizeFirstLetter = function() {
                    return this.charAt(0).toUpperCase() + this.slice(1);
                };

                String.prototype.lowerFirstLetter = function() {
                    return this.charAt(0).toLowerCase() + this.slice(1);
                };

                Array.prototype.removeFirst = function(){
                    return this.slice(1, this.length);
                };

                Array.prototype.remove = function(object){
                    var index = this.indexOf(object);
                    if(index>-1){
                        return this.splice(index,1);
                    }else{
                        return this;
                    }
                };

                window.alertMessage = function(msg){
                    app.utils.alert(msg, '提示');
                };
            },
            /**
             * placeholder for IE
             */
            _IEPlaceholder: function() {
                var doc = document,
                    inputs = doc.getElementsByTagName('input'),
                    supportPlaceholder = 'placeholder' in doc.createElement('input'),
                    placeholder = function(input) {
                        var text = input.getAttribute('placeholder'),
                            defaultValue = input.defaultValue;
                        if (defaultValue == '') {
                            input.value = text;
                        }

                        $(input).on('focus', function() {
                            if (input.value === text) {
                                this.value = '';
                            }
                        });

                        $(input).on('blur', function() {
                            if (input.value === '') {
                                this.value = text;
                            }
                        });
                    };

                if (!supportPlaceholder) {
                    for (var i = 0, len = inputs.length; i < len; i++) {
                        var input = inputs[i],
                            text = input.getAttribute('placeholder');
                        if ( ( input.type === 'text' || input.type === 'password') && text) {
                            placeholder(input);
                        }
                    }
                }
            },
            getSessionItem: function(itemName){
                return $.parseJSON(sessionStorage.getItem(itemName));
            },
            setSessionItem: function(itemName, value){
                sessionStorage.setItem(itemName,JSON.stringify(value)) ;
            },
            clearSession: function(){
                sessionStorage.clear();
            },
            removeSessionItem: function(itemName){
                sessionStorage.removeItem(itemName);
            },
            alert: function(msg, title, func){
                title = title || '提示';
                var template = '';
                template += '<div class="modal-content">';
                template += '  <div class="modal-header ng-scope">';
                template += '      <h3 class="modal-title">' + title + '</h3>';
                template += '  </div>';
                template += '  <div class="modal-body clearfix">';
                template += '    <div class="col-sm-12">';
                template += '      ' + msg;
                template += '    </div>';
                template += '  </div>';
                template += '  <div class="modal-footer ng-scope">';
                template += '      <button class="btn btn-warning" style="width:100%;" type="button" ng-click="ok()">提交</button>';
                template += '  </div>';
                template += '</div>';
                var modalInstance = $uibModal.open({
                    animation: true,
                    template: template,
                    controller: 'AppUtils.Alert',
                    size: 'sm'
                });

                modalInstance.result.then(function(){
                    if(_.isFunction(func)){
                        func();
                    }
                }, function(){
                    if(_.isFunction(func)){
                        func();
                    }
                });
            },
            confirm: function(title, msg, func){
                var template = '';
                template += '<div class="modal-content">';
                template += '  <div class="modal-header ng-scope">';
                template += '      <h3 class="modal-title">' + title + '</h3>';
                template += '  </div>';
                template += '  <div class="modal-body clearfix">';
                template += '    <div class="col-sm-12">';
                template += '      ' + msg;
                template += '    </div>';
                template += '  </div>';
                template += '  <div class="modal-footer ng-scope">';
                template += '      <button class="btn btn-info" type="button" ng-click="ok()">提交</button>';
                template += '      <button class="btn btn-warning" type="button" ng-click="cancel()">取消</button>';
                template += '  </div>';
                template += '</div>';
                var modalInstance = $uibModal.open({
                    animation: true,
                    template: template,
                    controller: 'AppUtils.Confirm',
                    size: 'sm',
                    resolve: {
                        func: function(){return func}
                    }
                });

                return modalInstance.result;
            },
            doLoading: function(){
                requestCount++;
                if(requestCount>0)
                    $('#spinner').show();
                
            },
            whenLoaded: function(){
                requestCount--;
                if(requestCount<=0){
                    requestCount = 0;
                    $('#spinner').hide();
                }
            },
            preventLoading: function(){
                requestCount--;
            },
            clone: function(val){
                return JSON.parse(JSON.stringify(val));
            }
        };
        return app.utils;
    }]);

angular.module('BeehivePortal')
  .controller('AppUtils.Confirm',function ($scope, $uibModalInstance, func) {
    $scope.ok = function () {
        $uibModalInstance.close(func());
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  })
  .controller('AppUtils.Alert',function ($scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.dismiss('cancel');
    };
  });