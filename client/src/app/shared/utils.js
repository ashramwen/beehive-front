angular.module('BeehivePortal').factory('AppUtils', ['$uibModal',function ($uibModal) {
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
                app.utils.alert({msg: msg});
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
        alert: function(options){

            options.title = options.title || 'app.popover.alertMessageTitle';
            var template = '';
            template += '<div class="modal-content">';
            template += '  <div class="modal-header ng-scope">';
            template += '      <h3 class="modal-title">{{"' + options.title + '" | translate: data}}</h3>';
            template += '  </div>';
            template += '  <div class="modal-body clearfix">';
            template += '    <div class="col-sm-12">';
            template += '      <p style="word-wrap: break-word;">{{"' + options.msg + '" | translate: data}}</p>';
            template += '    </div>';
            template += '  </div>';
            template += '  <div class="modal-footer ng-scope">';
            template += '      <button class="btn btn-warning" style="width:100%;" type="button" ng-click="ok()">{{"controls.ok" | translate}}</button>';
            template += '  </div>';
            template += '</div>';
            var modalInstance = $uibModal.open({
                animation: true,
                template: template,
                controller: 'AppUtils.Alert',
                resolve: {
                    data: function(){return options.data;}
                },
                size: 'sm'
            });

            modalInstance.result.then(function(){
                if(_.isFunction(options.callback)){
                    options.callback();
                }
            }, function(){
                if(_.isFunction(options.callback)){
                    options.callback();
                }
            });
        },
        confirm: function(options){

            options.title = options.title || 'app.popover.confirmMessageTitle';
            var template = '';
            template += '<div class="modal-content">';
            template += '  <div class="modal-header ng-scope">';
            template += '      <h3 class="modal-title">{{"' + options.title + '" | translate: data}}</h3>';
            template += '  </div>';
            template += '  <div class="modal-body clearfix">';
            template += '    <div class="col-sm-12">';
            template += '      <p style="word-wrap: break-word;">{{"' + options.msg + '" | translate: data}}</p>';
            template += '    </div>';
            template += '  </div>';
            template += '  <div class="modal-footer ng-scope">';
            template += '      <button class="btn btn-info" type="button" ng-click="ok()">{{"controls.ok" | translate}}</button>';
            template += '      <button class="btn btn-warning" type="button" ng-click="cancel()">{{"controls.cancel" | translate}}</button>';
            template += '  </div>';
            template += '</div>';
            var modalInstance = $uibModal.open({
                animation: true,
                template: template,
                controller: 'AppUtils.Confirm',
                size: 'sm',
                resolve: {
                    func: function(){return options.callback;},
                    data: function(){return options.data;}
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
  .controller('AppUtils.Confirm', ['$scope', '$uibModalInstance', 'func', 'data', function ($scope, $uibModalInstance, func, data) {
    $scope.data = data;
    $scope.ok = function () {
        if(func && _.isFunction(func)){
            $uibModalInstance.close(func());
        }else{
            $uibModalInstance.close();
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
  }])
  .controller('AppUtils.Alert', ['$scope', '$uibModalInstance', 'data', function ($scope, $uibModalInstance, data) {
    $scope.data = data;
    $scope.ok = function () {
        $uibModalInstance.dismiss('cancel');
    };
  }]);