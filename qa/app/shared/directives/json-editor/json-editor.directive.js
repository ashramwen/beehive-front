angular.module('BeehivePortal')
  .directive('jsonEditor', [function(){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            ngModel: '=?'
        },
        templateUrl: 'app/shared/directives/json-editor/json-editor.template.html',
        controller: ['$scope', function($scope){

            $scope.fieldList = [];

            $scope.typeOptions = [
                {text: '字符串', value: 'string'},
                {text: '数字', value: 'float'},
                {text: '布尔', value: 'boolean'}
            ];

            $scope.booleanValues = [
                {text: 'true', value: true},
                {text: 'false', value: false}
            ];

            $scope.addField = function(){
                $scope.fieldList.push({
                    type: 'string',
                    value: '',
                    fieldName: ''
                });
            };


            $scope.$watch('ngModel', function(newVal, oldVal){
                if(!newVal){
                    $scope.ngModel = {};
                    return;
                }

                if(angular.equals(newVal, oldVal)){
                    return;
                }

                $scope.fieldList = [];
                _.each(newVal, function(value, key){
                    $scope.fieldList.push({
                        fieldName: key,
                        value: value,
                        type: _.isString(value)?'string': 'float'
                    })
                });
            });

            $scope.$watch('fieldList', function(newVal){
                if(!$scope.ngModel) return;
                _.each($scope.ngModel, function(value, key){
                    delete $scope.ngModel[key];
                });

                _.each(newVal, function(field){
                    if(!field.value && field.value != false){
                        $scope.ngModel[field.fieldName] = null;
                        return;
                    }

                    switch(field.type){
                        case 'boolean':
                            $scope.ngModel[field.fieldName] = field.value;
                            break;
                        case 'string':
                            $scope.ngModel[field.fieldName] = field.value.toString();
                            break;
                        case 'float':
                            $scope.ngModel[field.fieldName] = parseFloat(field.value);
                            break;
                    }
                });
            },true);

        }]
    };
  }]);