angular.module('BeehivePortal')

.factory('$$User', ['$resource', function($resource) {
    var User = $resource(MyAPIs.USER + '/:userID', { userID: '@userID' }, {
        get: {
            method: 'GET',
            url: MyAPIs.USER + '/me'
        },
        update: {
            method: 'PATCH',
            url: MyAPIs.USER + '/me'
        },
        setCustomData: { //保存用户自定义信息
            url: MyAPIs.USER + '/me/customData/:name',
            method: 'PUT',
            params: {
                name: '@name'
            }
        },
        getCustomData: { //获取用户自定义信息
            url: MyAPIs.USER + '/me/customData/:name',
            method: 'GET',
            params: {
                name: '@name'
            }
        },
        getChartData: {
            url: MyAPIs.USER + '/me/ugc/chart/:name',
            method: 'GET',
            params: {
                name: '@name'
            }
        },
        setChartData: {
            url: MyAPIs.USER + '/me/ugc/chart/:name',
            method: 'PUT',
            params: {
                name: '@name'
            }
        },
        setUGC: { // 保存用户生产内容(UGC)
            url: MyAPIs.USER + '/me/ugc/:type/:name',
            method: 'PUT',
            params: {
                type: '@type',
                name: '@name'
            }
        },
        getUGC: { // 读取UGC
            url: MyAPIs.USER + '/me/ugc/:type/:name',
            method: 'GET',
            params: {
                type: '@type',
                name: '@name'
            }
        },
        getAllUGC: { // 批量读取UGC
            url: MyAPIs.USER + '/me/ugc/:type',
            method: 'GET',
            isArray: true,
            params: {
                type: '@type'
            }
        },
        deleteUGC: { // 删除UGC
            url: MyAPIs.USER + '/me/ugc/:type/:name',
            method: 'DELETE',
            params: {
                type: '@type',
                name: '@name'
            }
        },
        bindThing: {
            url: MyAPIs.THING + '/:globalThingIDs/users/:userIDs',
            params: {
                userIDs: '@userIDs',
                globalThingIDs: '@globalThingIDs'
            },
            method: 'POST'
        },
        unbindThing: {
            url: MyAPIs.THING + '/:globalThingIDs/users/:userIDs',
            params: {
                userIDs: '@userIDs',
                globalThingIDs: '@globalThingIDs'
            },
            method: 'DELETE'
        },
        bindTag: {
            url: MyAPIs.TAG + '/:tags/users/:userIDs',
            method: 'POST',
            params: {
                userIDs: '@userIDs',
                tags: '@tags'
            }
        },
        unbindTag: {
            url: MyAPIs.TAG + '/:tags/users/:userIDs',
            method: 'DELETE',
            params: {
                userIDs: '@userIDs',
                tags: '@tags'
            }
        },
        getTags: {
            url: MyAPIs.TAG + '/user/:userID',
            method: 'GET',
            params: {
                userID: '@userID'
            },
            isArray: true
        },
        getThings: {
            url: MyAPIs.THING + '/user/:userID',
            method: 'GET',
            params: {
                userID: '@userID'
            },
            isArray: true
        },
        getPermissions: {
            url: MyAPIs.USER + '/permissionTree',
            method: 'GET',
            isArray: true
        },
        changePassword: {
            url: MyAPIs.USER + '/changepassword',
            method: 'POST'
        },
        query: {
            url: MyAPIs.USER + '/simplequery',
            method: 'POST',
            isArray: true,
            transformRequest: function(data, headers) {
                return JSON.stringify(data);
            }
        }
    });

    return User;
}])

.factory('$$Auth', ['$resource', function($resource) {
    var $$Auth = $resource(MyAPIs.OPERATOR, {}, {
        initpassword: {
            method: 'POST',
            url: MyAPIs.OPERATOR + '/initpassword'
        },
        activate: {
            url: MyAPIs.OPERATOR + '/activate',
            method: 'POST'
        },
        login: {
            url: MyAPIs.OPERATOR + '/login',
            method: 'POST'
        },
        logout: {
            url: MyAPIs.OPERATOR + '/logout',
            method: 'POST'
        },
        validate: {
            url: MyAPIs.OPERATOR + '/validatetoken',
            method: 'POST'
        }
    });

    return $$Auth;
}])

.factory('$$MechineLearning', ['$resource', 'Session', function($resource, Session) {
    var mlUrl = 'http://114.215.196.178:8082/beehive-ml/ml/scenario';


    var $$MechineLearning = $resource(mlUrl + '/apply', {}, {
        getList: {
            url: mlUrl + '/list',
            method: 'GET',
            headers: {
                'Authorization': 'Basic YWRtaW46YWRtaW4='
            }
        },
        createTask: {
            url: mlUrl + '/apply',
            method: 'POST',
            headers: {
                'Authorization': 'Basic YWRtaW46YWRtaW4='
            },
            transformRequest: function(data) {
                var credential = Session.getCredential();

                _.extend(data, {
                    cloudUrl: appConfig[appConfig.ENV].cloudUrl,
                    cloudAppId: appConfig[appConfig.ENV].kiiAppID,
                    ownerId: credential.id,
                    ownerToken: credential.accessToken,
                    type: "ROOM_LIGHT"
                });

                return JSON.stringify(data);
            },
            transformResponse: function(data) {
                return { taskID: ~~data };
            }
        },
        enableTask: {
            url: mlUrl + '/:id/enable/true',
            method: 'GET',
            params: {
                id: '@id'
            },
            headers: {
                'Authorization': 'Basic YWRtaW46YWRtaW4='
            }
        },
        disableTask: {
            url: mlUrl + '/:id/enable/false',
            method: 'GET',
            params: {
                id: '@id'
            },
            headers: {
                'Authorization': 'Basic YWRtaW46YWRtaW4='
            }
        },
        deleteTask: {
            url: mlUrl + '/:id',
            method: 'DELETE',
            params: {
                id: '@id'
            },
            headers: {
                'Authorization': 'Basic YWRtaW46YWRtaW4='
            }
        }
    });
    return $$MechineLearning;
}])

.factory('$$Monitor', ['$resource', function($resource) {
    var mUrl = MyAPIs.USER + '/me/thingMonitors';
    var $$Monitor = $resource(MyAPIs.USER, {}, {
        add: {
            url: mUrl + '/addMonitor',
            method: 'POST'
        },
        get: {
            url: mUrl + '/:id',
            method: 'GET',
            isArray: true,
            params: {
                id: '@id'
            }
        },
        update: {
            url: mUrl + '/:id',
            method: 'PUT',
            params: {
                id: '@id'
            }
        },
        delete: {
            url: mUrl + '/:id',
            method: 'DELETE',
            params: {
                id: '@id'
            }
        },
        getByGroup: {
            url: mUrl + '/group/:groupName',
            method: 'GET',
            isArray: true,
            params: {
                groupName: '@groupName'
            }
        },
        enable: {
            url: mUrl + '/:id/enable',
            method: 'PUT',
            params: {
                id: '@id'
            }
        },
        disable: {
            url: mUrl + '/:id/disable',
            method: 'PUT',
            params: {
                id: '@id'
            }
        }
    });

    return $$Monitor;
}])

.factory('$$UserManager', ['$resource', function($resource) {
    var $$UserManager = $resource(MyAPIs.USER_MANAGER + '/:userID', { userID: '@userID' }, {
        update: {
            method: 'PATCH',
            url: MyAPIs.USER_MANAGER + '/:userID',
            params: {
                userID: '@userID'
            }
        },
        remove: {
            method: 'DELETE',
            url: MyAPIs.USER_MANAGER + '/:userID',
            params: {
                userID: '@userID'
            }
        },
        create: {
            url: MyAPIs.USER_MANAGER,
            method: 'POST'
        },
        changePassword: {
            url: MyAPIs.USER_MANAGER + '/:userID/resetpassword',
            method: 'POST',
            params: {
                userID: '@userID'
            }
        },
        query: {
            url: MyAPIs.USER + '/simplequery',
            method: 'POST',
            isArray: true,
            transformRequest: function(data, headers) {
                return JSON.stringify(data);
            }
        }
    });

    return $$UserManager;
}])

.factory('$$UserGroup', ['$resource', function($resource) {
    var UserGroup = $resource(MyAPIs.USER_GROUP + '/:id', { id: '@userGroupID' }, {
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
            method: 'POST',
            url: MyAPIs.USER_GROUP,
            params: {
                userGroupID: '@userGroupID'
            }
        },
        remove: {
            method: 'DELETE'
        },
        get: {
            url: MyAPIs.USER_GROUP + '/:userGroupID',
            method: 'GET',
            params: { userGroupID: '@userGroupID' }
        },
        getList: {
            url: MyAPIs.USER_GROUP + '/all',
            method: 'GET',
            isArray: true
        },
        getMyGroups: {
            url: MyAPIs.USER_GROUP + '/list',
            method: 'GET',
            isArray: true
        },
        withUserData: {
            url: MyAPIs.USER_GROUP + '/simplequery',
            method: 'POST',
            transformRequest: function(data, headers) {
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
            url: MyAPIs.USER_GROUP,
            method: 'GET',
        },
        bindThing: {
            url: MyAPIs.THING + '/:globalThingIDs/userGroups/:userGroupIDs',
            params: {
                userGroupIDs: '@userGroupIDs',
                globalThingIDs: '@globalThingIDs'
            },
            method: 'POST'
        },
        unbindThing: {
            url: MyAPIs.THING + '/:globalThingIDs/userGroups/:userGroupIDs',
            params: {
                userGroupIDs: '@userGroupIDs',
                globalThingIDs: '@globalThingIDs'
            },
            method: 'DELETE'
        },
        bindTag: {
            url: MyAPIs.TAG + '/:tags/userGroups/:userGroupIDs',
            params: {
                userGroupIDs: '@userGroupIDs',
                tags: '@tags'
            },
            method: 'POST'
        },
        unbindTag: {
            url: MyAPIs.TAG + '/:tags/userGroups/:userGroupIDs',
            params: {
                userGroupIDs: '@userGroupIDs'
            },
            method: 'DELETE'
        },
        getTags: {
            url: MyAPIs.TAG + '/userGroup/:userGroupID',
            params: {
                userGroupID: '@userGroupID'
            },
            method: 'GET',
            isArray: true
        },
        getThings: {
            url: MyAPIs.THING + '/userGroup/:userGroupID',
            params: {
                userGroupID: '@userGroupID'
            },
            method: 'GET',
            isArray: true
        }
    });

    return UserGroup;
}])

.factory('$$Thing', ['$resource', function($resource) {
    var Thing = $resource(MyAPIs.THING + '/:globalThingID', {}, {
        getGateways: {
            url: MyAPIs.THING + '/gateway',
            method: 'GET',
            isArray: true
        },
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
            params: { thingids: '@things', tags: '@tags' },
            method: 'POST'
        },
        removeTags: {
            url: MyAPIs.THING + '/:things/tags/custom/:tags',
            params: { things: '@things', tags: '@tags' },
            method: 'DELETE'
        },
        byTag: {
            url: MyAPIs.THING + '/search?tagType=:tagType&displayName=:displayName',
            params: { tagType: '@tagType', displayName: '@displayName' },
            method: 'GET',
            isArray: true,
            //cache : true
        },
        byType: {
            url: MyAPIs.THING + '/types/:typeName',
            params: { typeName: '@typeName' },
            method: 'GET',
            isArray: true
        },
        sendCommand: {
            url: MyAPIs.THING_IF + '/command/',
            method: 'POST',
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
            url: MyAPIs.TRIGGER + '/things/:globalThingID',
            isArray: true,
            params: {
                globalThingID: '@globalThingID'
            }
        },
        getOnboardingInfo: {
            method: 'GET',
            url: MyAPIs.ONBOARDING + '/:vendorThingID',
            params: { vendorThingID: '@vendorThingID' }
        },
        onboard: {
            method: 'POST',
            url: MyAPIs.THING + '/onboarding/:vendorThingID',
            params: { vendorThingID: '@vendorThingID' }
        },
        getEndNodes: {
            url: MyAPIs.THING + '/:globalThingID/endnodes',
            params: { globalThingID: '@globalThingID' },
            method: 'GET',
            isArray: true
        },
        getEndNode: {
            url: MyAPIs.CLOUD_THING_IF + '/apps/:kiiAppID/targets/THING::thingID/states',
            params: { thingID: '@thingID', kiiAppID: '@kiiAppID' },
            headers: {
                Authorization: 'Bearer c63Z840BhnyLgyL6TAoKeq0iGdUM6L1vZemenWrWjxc'
            },
            method: 'GET'
        },
        replaceEndNode: {
            url: MyAPIs.CLOUD_THING_IF + '/apps/:kiiAppID/things/:kiiThingID/end-nodes/:thingID',
            params: { thingID: '@thingID', kiiAppID: '@kiiAppID', kiiThingID: '@kiiThingID' },
            headers: {
                Authorization: 'Bearer c63Z840BhnyLgyL6TAoKeq0iGdUM6L1vZemenWrWjxc'
            },
            transformRequest: function(data) {
                data = _.clone(data);
                _.each(data, function(value, fieldName) {
                    if (fieldName != 'endNodeVendorThingID' && fieldName != 'endNodePassword') {
                        delete data[fieldName];
                    }
                });

                return JSON.stringify(data);
            },
            method: 'PATCH'
        },
        removeEndNode: {
            method: 'DELETE',
            url: MyAPIs.CLOUD_THING_IF + '/apps/:kiiAppID/things/:kiiThingID/end-nodes/:thingID',
            params: { thingID: '@thingID', kiiAppID: '@kiiAppID', kiiThingID: '@kiiThingID' },
            headers: {
                Authorization: 'Bearer c63Z840BhnyLgyL6TAoKeq0iGdUM6L1vZemenWrWjxc'
            }
        },
        getCommands: {
            method: 'POST',
            url: MyAPIs.THING_IF + '/command/list',
            isArray: true
        },
        getThingsByLocationType: {
            url: MyAPIs.REPORTS + '/thingQuery',
            method: 'POST',
            isArray: true
        },
        getThingsByIDs: {
            url: MyAPIs.THING + '/queryDetailByIDs',
            method: 'POST',
            isArray: true
        },
        /**
         * [getHistory description]
         * @type {Object}
         * @example
         * {
                "vendorThingID": "0807W-A17-C-078",
                "startDate": 0,
                "endDate": 1562865748745,
                "indexType": "192b49ce",
                "dateField": "state.date",
                "size": 100,
                "from": 0
            }
         */
        getHistory: {
            url: MyAPIs.ES + '/historical',
            method: 'POST',
            transformRequest: function(request) {
                _.extend(request, {
                    indexType: appConfig[appConfig.ENV].kiiAppID,
                    dateField: 'state.date'
                });

                return JSON.stringify(request);
            }
        }
    });

    return Thing;
}])

.factory('$$Tag', ['$resource', function($resource) {
    var Tag = $resource(MyAPIs.TAG + '/:id', { id: '@tagName' }, {
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
            params: { id: '@tagName' },
            method: 'DELETE'
        }
    });

    return Tag;
}])

.factory('$$Location', ['$resource', function($resource) {
    var $$Location = $resource(MyAPIs.TAG + '/:id', { id: '@tagName' }, {
        queryAll: {
            method: 'GET',
            url: MyAPIs.LOCATION_TAGS + '/fullTree',
            cache: true
        },
        getTopLevel: {
            method: 'GET',
            url: MyAPIs.LOCATION_TAGS + '/topLevel',
            isArray: true,
            cache: true
        },
        getSubLevel: {
            method: 'GET',
            url: MyAPIs.LOCATION_TAGS + '/:location/subLevel',
            params: {
                type: '@location'
            },
            isArray: true,
            cache: true
        },
        getThingsByLocation: {
            method: 'GET',
            url: MyAPIs.LOCATION_TAGS + '/:location/things',
            params: {
                type: '@location'
            },
            isArray: true
        },
        getAllThingsByLocation: {
            method: 'GET',
            url: MyAPIs.LOCATION_TAGS + '/:location/allThings',
            params: {
                type: '@location'
            },
            isArray: true
        },
        getParent: {
            method: 'GET',
            url: MyAPIs.LOCATION_TAGS + '/:location/parent',
            isArray: true,
            cache: true
        }
    })

    return $$Location;
}])

.factory('$$Type', ['$resource', '$cacheFactory', function($resource, $cacheFactory) {
    var Type = $resource(MyAPIs.TYPE, {}, {
        getAll: {
            method: 'GET',
            isArray: true,
            cache: true
        },
        getSchema: {
            url: MyAPIs.SCHEMA + '/query/industrytemplate?thingType=:type&name=:type&version=1',
            method: 'GET',
            cache: true
        },
        saveSchema: {
            url: MyAPIs.SCHEMA + 'manage/industrytemplate',
            method: 'POST'
        },
        updateSchema: {
            url: MyAPIs.SCHEMA + '/manage/industrytemplate/:id',
            method: 'PUT',
            params: {
                id: '@id'
            },
            transformRequest: function(data, headers) {
                var schema = data;
                var thingType = schema.thingType;
                var name = schema.name;
                var version = schema.version;
                var $httpDefaultCache = $cacheFactory.get('$http');
                var queris = [
                    'thingType=' + thingType,
                    'name=' + name,
                    'version=' + version
                ];

                $httpDefaultCache.remove(MyAPIs.SCHEMA + '/query/industrytemplate?' + queris.join('&'));
                return JSON.stringify(data);
            }
        },
        byTags: {
            url: MyAPIs.TYPE + '/fulltagname/:tags',
            params: {
                tags: '@tags'
            },
            method: 'GET',
            isArray: true
        }
    });
    return Type;
}])

.factory('$$Permission', ['$resource', function($resource) {
    var Permission = $resource(MyAPIs.PERMISSION, {}, {
        get: {
            url: MyAPIs.SYSTEM_PERMISSION,
            method: 'GET'
        }
    });

    return Permission;
}])

.factory('$$Supplier', ['$resource', function($resource) {
    var Supplier = $resource(MyAPIs.SUPPLIER, {}, {
        getAll: {
            url: MyAPIs.SUPPLIER + '/all',
            method: 'GET',
            isArray: true
        }
    });
    return Supplier;
}])

.factory('$$Trigger', ['$resource', function($resource) {
    var Trigger = $resource(MyAPIs.TRIGGER, {}, {
        getAll: {
            url: MyAPIs.TRIGGER + '/all',
            method: 'GET',
            isArray: true,
            transformResponse: function(response) {
                response = JSON.parse(response);
                response = _.reject(response, function(trigger) {
                    if (trigger.type == Trigger.TypeEnum.SIMPLE) {
                        if (!trigger.source) {
                            return false;
                        } else if (trigger.source.thingID) {
                            return true;
                        }
                        return false;
                    }
                    return false;
                });
                return response;
            }
        },
        get: {
            url: MyAPIs.TRIGGER + '/:triggerID',
            method: 'GET'
        },
        save: {
            url: MyAPIs.TRIGGER + '/createTrigger',
            method: 'POST'
        },
        remove: {
            url: MyAPIs.TRIGGER + '/:triggerID',
            method: 'DELETE'
        },
        enable: {
            url: MyAPIs.TRIGGER + '/:triggerID/enable',
            method: 'PUT',
            params: {
                triggerID: '@triggerID'
            }
        },
        disable: {
            url: MyAPIs.TRIGGER + '/:triggerID/disable',
            method: 'PUT',
            params: {
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
}])

.factory('$$Schema', ['$resource', function($resource) {
    var Schema = $resource(MyAPIs.SCHEMA, {}, {
        getByType: {
            url: MyAPIs.SCHEMA + '/query/industrytemplate',
            method: 'GET',
            params: {
                thingType: '@thingType',
                name: '@name',
                version: '@version'
            }
        }
    });
    return Schema;
}]);