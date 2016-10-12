
angular.module('BeehivePortal')
  .directive('thingFilter', ['$compile', function($compile){
    return{
      restrict: 'E',
      replace: true,
      scope:{
          singleType: '=?',
          change: '&',
          disabled: '=?',
          input: '=?',
          search: '=?'
      },
      templateUrl: 'app/shared/directives/thing-filter/thing-filter.template.html',
      controller:['$scope', '$$Type', '$$Thing', function($scope, $$Type, $$Thing){

        $scope.things = [];
        $scope.usedTypes = [];

        $scope.ready = false;
        $$Type.getAll(function(types){
          if(!$scope.selectedType){
            $scope.selectedType = types.length>0? types[0].type : null;
          }
          $scope.allTypes = _.map(types, function(type){
            var _type = {
              text: type.type,
              value: type.type
            };

            $$Type.getSchema({type: type.type}, function(schema){
              if(schema.content){
                if(_.isEmpty(schema.content.statesSchema.title)) return;
                _type.text = schema.content.statesSchema.title;
              }
            });
            return _type;
          });
          $scope.$broadcast('ready', true);
        });

        /**
         * {type: selectedThings}
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        $scope.input = function(data){
          $scope.usedTypes = data.usedTypes || [];
          $scope.selectedType = data.type || null;
          $scope.onlyType = data.onlyType;
          if($scope.onlyType){
            $scope.selectedType = $scope.onlyType;
          }
          if(data.hasOwnProperty('location')){
            $scope.initLocation = data.location;
          }
        };

        $scope.locationChange = function(locationID, fullLocation, locationDisplayName){
          $scope.selectedLocation = {
            locationID: locationID,
            fullLocation: fullLocation,
            displayName: locationDisplayName
          };
        };

        $scope.init = function(){
          $scope.types = $scope.allTypes;

          $scope.$watch('usedTypes', function(newVal){
            if(!newVal) return;
            $scope.types = $scope.getTypes();
          });
        };

        $scope.$on('ready', function(ready){
          if(!ready)return;
          $scope.init();
          $scope.$emit('type-loaded');
        });

        $scope.getTypes = function(){
          if($scope.onlyType){
            return _.where($scope.allTypes, {value: $scope.onlyType});
          }

          return _.filter($scope.allTypes, function(type){
            return !_.find($scope.usedTypes, function(value){
              return value == type.value;
            });
          });
        };


        $scope.typeChange = function(value, initialized){
          if($scope.singleType && value != $scope.selectedType && initialized){
            $scope.things = [];
          }
          $scope.things = [];
          $scope.change({things: $scope.things, type: _.find($scope.types, {value: value}), location: $scope.selectedLocation});
        };


        $scope.search = function(){
          if(!$scope.selectedType || !$scope.selectedLocation) return;
          var searchQuery = {
            type: $scope.selectedType, 
            locationPrefix: $scope.selectedLocation.locationID, 
            includeSubLevel: true
          };

          $$Thing.getThingsByLocationType(searchQuery, function(things){
            $scope.things = _.map(things, function(thing){
              return {
                globalThingID: thing.thingID, 
                vendorThingID: thing.vendorThingID,
                type: $scope.selectedType, 
                typeDisplayName: _.find($scope.types, {value: $scope.selectedType}).text,
                locationDisplayName: $scope.selectedLocation.displayName,
                location: $scope.selectedLocation.locationID,
                fullLocation: $scope.selectedLocation.fullLocation
              };
            });
            $scope.change({things: $scope.things, type:  _.find($scope.types, {value: $scope.selectedType}), location: $scope.selectedLocation});
          });
        };

      }]
    };
  }]);