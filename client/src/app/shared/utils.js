angular.module('BeehivePortal')
    .factory('AppUtils', ['$http', '$location', '$q', '$state', '$timeout',
    function ($http, $location, $q, $state, $timeout) {
        window.app = {};
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
                }
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
            alertMessage: function(){
                
            }
        };
        return app.utils;
    }]);
