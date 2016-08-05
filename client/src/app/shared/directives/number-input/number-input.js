angular.module('BeehivePortal')
  .directive('numberInput', ['$compile', function($compile){
    return{
      restrict: 'E',
      replace: true,
      scope:{
          ngModel: '=?',
          type: '=?',
          min: '=?',
          max: '=?'
      },
      templateUrl: 'app/shared/directives/number-input/number-input.html',
      controller:['$scope', function($scope){

          $scope.value = $scope.ngModel;
          $scope.$watch('value', function(newVal){
              $scope.ngModel = parseFloat(newVal);

              if(!_.isNaN($scope.ngModel)){
                $scope.restrict();
              }
          });

          $scope.restrict = function(){
            if(_.isNumber($scope.max) && $scope.ngModel > $scope.max){
              $scope.ngModel = $scope.max;
              $scope.value = $scope.max;
            }
            if(_.isNumber($scope.min) && $scope.ngModel < $scope.min){
              $scope.ngModel = $scope.min;
              $scope.value = $scope.min;
            }
            if($scope.type == 'int'){
              $scope.ngModel |= 0;
              $scope.value |= 0 ;
            }
          };

          $scope.plus = function(){
            $scope.value += 1;
            $scope.ngModel += 1;
            $scope.restrict();
          };

          $scope.minus = function(){
            $scope.ngModel -= 1;
            $scope.value -= 1;
            $scope.restrict();
          };

      }]
    };
  }]);