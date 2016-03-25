angular.module('BeehivePortal')
  .factory('$$User', ['$resource', function($resource) {
      var User = $resource(MyAPIs.USER + '/:id',{ id: '@userID' }, {
          update: {
              method: 'PATCH' // this method issues a PUT request
          },
          remove:{
              method: 'DELETE'
          },
          create:{
              url: MyAPIs.USER,
              method: 'POST'
          },
          query:{
              url: MyAPIs.USER + '/simplequery',
              method: 'POST',
              isArray: true
          },
          register: {
              url: MyAPIs.OPERATOR + '/register',
              method: 'POST'
          },
          login: {
              url: MyAPIs.OPERATOR + '/login',
              method: 'POST'
          },
          changePassword: {
              url: MyAPIs.OPERATOR + '/changepassword',
              method: 'POST'
          },
          logout: {
              url: MyAPIs.OPERATOR + 'logout',
              method: 'POST'
          }
      });

      //User.query = searchUser.query;
      return User;
  }])
  .factory('$$UserGroup', ['$resource', function($resource){
      var UserGroup = $resource(MyAPIs.USER_GROUP + '/:id',{id: '@userGroupID'}, {
          addUser: {
              method: 'POST',
              url: MyAPIs.USER_GROUP + '/:userGroupID/user/:userID',
              params: {
                  userGroupID: '@userGroupID',
                  userID: '@userID'
              }
          },
          deleteUser: {
              method: 'DELETE',
              url: MyAPIs.USER_GROUP + '/:userGroupID/user/:userID',
              params: {
                  userGroupID: '@userGroupID',
                  userID: '@userID'
              }
          },
          update: {
              method: 'PATCH'
          },
          remove: {
              method: 'DELETE'
          },
          get: {
              url: MyAPIs.USER_GROUP + '/:userGroupID',
              method: 'GET',
              params:{userGroupID: '@userGroupID'}
          },
          getList: {
              url: MyAPIs.USER_GROUP + '/all',
              method: 'GET',
              isArray: true
          },
          getMyGroups:{
              url: MyAPIs.USER_GROUP + '/list',
              method: 'GET',
              isArray: true
          },
          withUserData: {
              url: MyAPIs.USER_GROUP + '/simplequery',
              method: 'POST',
              transformRequest: function(data, headers){
                  data.includeUserData = 1;
                  return data;
              }
          },
          create: {
              url: MyAPIs.USER_GROUP,
              method: 'POST'
          },
          query: {
              url: MyAPIs.USER_GROUP + '/simplequery',
              method: 'POST',
              isArray: true
          },
          getPermissions: {
              url: MyAPIs.USER_GROUP + '',
              method: 'GET',

          }
      });

      return UserGroup;
  }])
  .factory('$$Thing', ['$resource', function($resource){
      var Thing = $resource(MyAPIs.THING + '/:globalThingID', {}, {
          save: {
              url: MyAPIs.THING,
              params: {
                globalThingID: '@globalThingID'
              },
              method: 'POST'
          },
          getAll: {
              url: MyAPIs.THING + '/search',
              method: 'GET',
              isArray: true
          },
          remove: {
              method: 'DELETE'
          },
          bindTags: {
              url: MyAPIs.THING + '/:thingids/tags/custom/:tags',
              params:{thingids:'@things',tags: '@tags'},
              method: 'POST'
          },
          removeTags: {
              url: MyAPIs.THING + '/:things/tags/custom/:tags',
              params:{things: '@things', tags:'@tags'},
              method: 'DELETE'
          },
          byTag: {
              url: MyAPIs.THING + '/search?tagType=:tagType&displayName=:displayName',
              params:{tagType: '@tagType', displayName: '@displayName'},
              method: 'GET',
              isArray: true,
              //cache : true
          },
          byType: {
              url: MyAPIs.THING + '/types/:typeName',
              params: {typeName: '@typeName'},
              method: 'GET',
              isArray: true
          },
          sendCommand: {
              url: MyAPIs.THING_IF + '/command/',
              method : 'POST',
              isArray: true
          },
          getTypeByTag: {
              method: 'GET',
              url: MyAPIs.THING + '/types/fulltagname/:fullTagNames',
              isArray: true,
              params: {
                fullTagNames: '@fullTagNames'
              }
          },
          getTriggers: {
              method: 'GET',
              url: MyAPIs.TRIGGER + '/triggerList/:globalThingID',
              isArray: true,
              params: {
                globalThingID: '@globalThingID'
              }
          },
          getOnboardingInfo: {
              method: 'GET',
              url: MyAPIs.ONBOARDING + '/:globalThingID',
              params: {globalThingID: '@globalThingID'}
          },
          getEndNodes: {
              url: 'http://api-development-beehivecn3.internal.kii.com/thing-if/apps/:kiiAppID/things/:kiiThingID/end-nodes',
              params: {kiiThingID: '@kiiThingID', kiiAppID: '@kiiAppID'},
              headers: {
                Authorization: 'Bearer c63Z840BhnyLgyL6TAoKeq0iGdUM6L1vZemenWrWjxc'
              },
              method: 'GET'
          },
          getEndNode: {
              url: 'http://api-development-beehivecn3.internal.kii.com/thing-if/apps/:kiiAppID/targets/THING::thingID/states',
              params: {thingID: '@thingID', kiiAppID: '@kiiAppID'},
              headers: {
                Authorization: 'Bearer c63Z840BhnyLgyL6TAoKeq0iGdUM6L1vZemenWrWjxc'
              },
              method: 'GET'
          },
          replaceEndNode: {
              url: 'http://api-development-beehivecn3.internal.kii.com/thing-if/apps/:kiiAppID/things/:kiiThingID/end-nodes/:thingID',
              params: {thingID: '@thingID', kiiAppID: '@kiiAppID', kiiThingID: '@kiiThingID'},
              headers: {
                  Authorization: 'Bearer c63Z840BhnyLgyL6TAoKeq0iGdUM6L1vZemenWrWjxc'
              },
              transformRequest: function(data){
                  data = _.clone(data);
                  _.each(data, function(value, fieldName){
                      if(fieldName != 'endNodeVendorThingID' && fieldName != 'endNodePassword'){
                          delete data[fieldName];
                      }
                  });

                  return JSON.stringify(data);
              },
              method: 'PATCH'
          },
          removeEndNode: {
              method: 'DELETE',
              url: 'http://api-development-beehivecn3.internal.kii.com/thing-if/apps/:kiiAppID/things/:kiiThingID/end-nodes/:thingID',
              params: {thingID: '@thingID', kiiAppID: '@kiiAppID', kiiThingID: '@kiiThingID'},
              headers: {
                  Authorization: 'Bearer c63Z840BhnyLgyL6TAoKeq0iGdUM6L1vZemenWrWjxc'
              }
          }
      });

      return Thing;
  }])
  .factory('$$Tag', ['$resource', function($resource){
      var Tag = $resource(MyAPIs.TAG + '/:id',{id: '@tagName'}, {
          query: {
              method: 'GET'
          },
          queryAll: {
              url: MyAPIs.TAG + '/search?tagType=Custom',
              method: 'GET',
              isArray: true
          },
          create: {
              url: MyAPIs.TAG + '/custom',
              method: 'POST'
          },
          update: {
              url: MyAPIs.TAG + '/custom',
              method: 'POST'
          },
          remove: {
              url: MyAPIs.TAG + '/custom/:id',
              params: {id: '@tagName'},
              method: 'DELETE'
          }
      });

      return Tag;
  }])
  .factory('$$Location', ['$resource', function($resource){
      var $$Location = $resource(MyAPIs.TAG + '/:id', {id: '@tagName'}, {
          queryAll: {
              method: 'GET',
              isArray: true,
              url: MyAPIs.TAG + '/search?tagType=Location',
              //cache: true
          }
      })

      return $$Location;
  }])
  .factory('$$Type', ['$resource', function($resource){
      var Type = $resource(MyAPIs.TYPE, {}, {
          getAll: {
              method: 'GET',
              isArray: true,
              //cache: true
          },
          getSchema: {
              url: MyAPIs.SCHEMA + '?thingType=:type&name=:type&version=1',
              params:{
                  type: '@type'
              },
              method: 'GET',
              //cache : true
          },
          saveSchema: {
              url: MyAPIs.SCHEMA,
              method: 'POST'
          },
          byTags: {
              url: MyAPIs.TYPE + '/fulltagname/:tags',
              params:{
                  tags: '@tags'
              },
              method: 'GET',
              isArray: true
          }
      });
      return Type;
  }])
  .factory('$$Permission', ['$resource', function($resource){
      var Permission = $resource(MyAPIs.PERMISSION, {}, {
          getList: {
              url: MyAPIs.PERMISSION + '/list',
              method: 'GET',
              isArray: true
          },
          byGroup: {
              url: MyAPIs.PERMISSION + '/userGroup/:userGroupID',
              method: 'GET',
              params: {
                  userGroupID: '@userGroupID'
              },
              isArray: true
          },
          bindGroup: {
              url: MyAPIs.PERMISSION + '/:permissionID/userGroup/:userGroupID',
              params: {
                  userGroupID: '@userGroupID',
                  permissionID: '@permissionID'
              },
              method: 'POST'
          },
          unbindGroup: {
              url: MyAPIs.PERMISSION + '/:permissionID/userGroup/:userGroupID',
              method: 'DELETE',
              params: {
                  userGroupID: '@userGroupID',
                  permissionID: '@permissionID'
              }
          }
      });

      return Permission;
  }])
  .factory('$$Supplier', ['$resource', function($resource){
      var Supplier = $resource(MyAPIs.SUPPLIER, {}, {
          getAll: {
              url: MyAPIs.SUPPLIER + '/all',
              method: 'GET',
              isArray: true
          }
      });
      return Supplier;
  }])
  .factory('$$Trigger', ['$resource', function($resource){
      var Trigger = $resource(MyAPIs.TRIGGER, {}, {
          getAll: {
              url: MyAPIs.TRIGGER + '/all',
              method: 'GET',
              isArray: true,
              transformResponse: function(response){
                  response = JSON.parse(response);
                  response = _.reject(response, function(trigger){
                      if(trigger.type == Trigger.TypeEnum.SIMPLE){
                          if(!trigger.source){
                              return false;
                          }else if(trigger.source.thingID){
                              return true;
                          }
                          return false;
                      }
                      return false;
                  });
                  return response;
              }
          },
          save: {
              url: MyAPIs.TRIGGER + '/createTrigger',
              method: 'POST'
          },
          remove: {
              url: MyAPIs.TRIGGER + '/:triggerID/delete',
              method: 'PUT',
              params:{
                  triggerID: '@triggerID'
              }
          },
          enable: {
              url: MyAPIs.TRIGGER + '/:triggerID/enable',
              method: 'PUT',
              params:{
                  triggerID: '@triggerID'
              }
          },
          disable: {
              url: MyAPIs.TRIGGER + '/:triggerID/disable',
              method: 'PUT',
              params:{
                  triggerID: '@triggerID'
              }
          }
      });

      Trigger.TypeEnum = {
          SIMPLE: 'Simple',
          GROUP: 'Group',
          SUMMARY: 'Summary'
      };
      
      return Trigger;
  }]);
