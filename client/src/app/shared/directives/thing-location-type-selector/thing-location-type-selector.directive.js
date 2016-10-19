
angular.module('BeehivePortal')
  .directive('thingLocationTypeSelector', ['$compile', 'TriggerDetailService', 'Session', 'AppUtils', '$q', function($compile, TriggerDetailService, Session, AppUtils, $q){
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
          if(!$scope.selectedType){
            $scope.selectedType = types.length>0? types[0].type : null;
          }
          var allPromise = [];

          $scope.allTypes = _.map(types, function(type){
            var _type = {
              text: type.type,
              value: type.type
            };

            allPromise.push($$Type.getSchema({type: type.type}, function(schema){
              if(schema.content){
                if(_.isEmpty(schema.content.statesSchema.title)) return;
                _type.text = schema.content.statesSchema.title;
              }
            }).$promise);
            return _type;
          });

          $q.all(allPromise).then(function(){
            $scope.$broadcast('ready', true);
          });
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

          $$Thing.getThingsByLocationType(searchQuery, function(queriedThings){
            var things = _.map(queriedThings, function(queriedThing){
              return {
                globalThingID: queriedThing.thingID,
                vendorThingID: queriedThing.vendorThingID
              };
            });

            TriggerDetailService.getThingsDetail(things).then(function(things){
              $scope.things = things;
              $scope.things = _.reject(things, function(thing){
                return !thing.fullKiiThingID;
              });
              if($scope.creatorOnly){
                var credential = Session.getCredential();
                $scope.things = _.where($scope.things, {createBy: credential.id.toLocaleString()});
              }
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
          var _things = angular.copy(things);
          
          _.each(things, function(thing){
            delete thing._selected;
          });

          
          $scope.selectedThings = $scope.selectedThings.concat(_things);
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
          if(!initialized && angular.equals(value, $scope.selectedType)) return;

          if($scope.selectedThings && $scope.selectedThings.length && !initialized){
            var originType = $scope.selectedType;
            var targetType = value;

            AppUtils.confirm({
              title: '提示信息',
              msg: '若改变所选设备类型，当前所选设备将会被清空。您确认要更改吗？'
            }).then(function(){
              $scope.selectedThings = [];
              $scope.selectedType = targetType;
              $scope.typeChanged(targetType, false);
            });
            return false;
          } else{
            $scope.typeChanged(value, true);
          }
        };

        $scope.typeChanged = function(targetType, initialized){
          if($scope.singleType && targetType != $scope.selectedType && initialized){
            $scope.selectedThings = [];
          }
          $scope.things = [];
          $scope.change({selectedThings: $scope.selectedThings, type: targetType});
        }

        function onChange(){
          $scope.change({selectedThings: $scope.selectedThings, type: $scope.selectedType});
        }


      }]
    };
  }]);