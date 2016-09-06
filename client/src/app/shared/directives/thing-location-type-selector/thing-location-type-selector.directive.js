
angular.module('BeehivePortal')
  .directive('thingLocationTypeSelector', ['$compile', 'TriggerDetailService', 'Session', function($compile, TriggerDetailService, Session){
    return{
      restrict: 'E',
      replace: true,
      scope:{
          input: '=?',
          singleType: '=?',
          change: '&',
          disabled: '=?',
          creatorOnly: '=?'
      },
      templateUrl: 'app/shared/directives/thing-location-type-selector/thing-location-type-selector.template.html',
      controller:['$scope', '$$Type', '$$Thing', function($scope, $$Type, $$Thing){

        $scope.ready = false;
        $$Type.getAll(function(types){
          $scope.selectedType = types.length>0? types[0].type : null;
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

        $scope.things = [];
        $scope.usedTypes = [];
        $scope.selectedThings = [];
        $scope.selectedType = null;
        $scope.selectedLocation = null;

        var TOTAL_ROW = 5;

        $scope.locationChange = function(locationID, fullLocation, locationDisplayName){
          $scope.selectedLocation = {
            locationID: locationID,
            fullLocation: fullLocation,
            displayName: locationDisplayName
          };
        };

        /**
         * {type: selectedThings}
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        $scope.input = function(data){
          $scope.usedTypes = data.usedTypes || [];
          $scope.selectedType = data.type || null;
          $scope.selectedThings = data.selectedThings || [];
          $scope.onlyType = data.onlyType;
          if($scope.onlyType){
            $scope.selectedType = $scope.onlyType;
          }
        };

        $scope.search = function(){
          if(!$scope.selectedType || !$scope.selectedLocation) return;
          var searchQuery = {
            type: $scope.selectedType, 
            locationPrefix: $scope.selectedLocation.locationID, 
            includeSubLevel: true
          };

          $$Thing.getThingsByLocationType(searchQuery, function(thingIDs){
            thingIDs = _.uniq(thingIDs);
            var things = _.map(thingIDs, function(thingID){
              return {
                globalThingID: thingID
              };
            }); 
            TriggerDetailService.getThingsDetail(things).then(function(things){
              $scope.things = things;
              if($scope.creatorOnly){
                var credential = Session.getCredential();
                $scope.things = _.where($scope.things, {createBy: credential.id.toLocaleString()});
              }
              /*
              $scope.things = _.map(thingIDs, function(thingID){
                return {
                  globalThingID: thingID, 
                  type: $scope.selectedType, 
                  typeDisplayName: _.find($scope.types, {value: $scope.selectedType}).text,
                  locationDisplayName: $scope.selectedLocation.displayName,
                  location: $scope.selectedLocation.locationID,
                  fullLocation: $scope.selectedLocation.fullLocation
                };
              });
              */
            });
          });
        };

        $scope.ownerFilter = function(thing){
          if(!$scope.creatorOnly) return false;
          var credential = Session.getCredential();
          if(thing.createBy == credential.id.toLocaleString()){
            return false;
          }
          return true;
        };

        $scope.emptyRowLeft = function(){
          var number = TOTAL_ROW - $scope.things.length;
          number = number > 0? number : 0;
          return new Array(number);
        };

        $scope.emptyRowRight = function(){
          var number = TOTAL_ROW - $scope.selectedThings.length;
          number = number > 0? number : 0;
          return new Array(number);
        };

        $scope.add = function(){
          $scope.selectedThings = $scope.selectedThings || [];
          var things = _.where($scope.things, {_selected: true});
          _.each(things, function(thing){
            delete thing._selected;
          });
          $scope.selectedThings = $scope.selectedThings.concat(things);
          onChange();
        };

        $scope.remove = function(){
          var things = _.where($scope.selectedThings, {_selected: true});
          $scope.selectedThings = _.reject($scope.selectedThings, {_selected: true});
          _.each(things, function(thing){
            delete thing._selected;
          });
          onChange();
        }

        $scope.getUnselectedThings = function(){
          return _.reject($scope.things, function(thing){
            return _.find($scope.selectedThings, {globalThingID: thing.globalThingID});
          });
        };

        $scope.selectAll = function(things){
          _.each(things, function(thing){
            if($scope.ownerFilter(thing)) return;
            thing._selected = true;
          });
        };

        $scope.toggleThingSelect = function(thing){
          if($scope.ownerFilter(thing)) return;
          thing._selected = ! thing._selected;
        }

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
            $scope.selectedThings = [];
          }
          $scope.things = [];
          $scope.change({selectedThings: $scope.selectedThings, type: value});
        };

        function onChange(){
          $scope.change({selectedThings: $scope.selectedThings, type: $scope.selectedType});
        }


      }]
    };
  }]);