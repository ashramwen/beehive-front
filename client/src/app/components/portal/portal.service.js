angular.module('BeehivePortal')
  .factory('PortalService', ['$http', '$q', 'Session', '$state', '$rootScope', function($http, $q, Session, $state, $rootScope) {
    var PortalService = {};

    /**
     * get states chan for navigation map on portal top navigation bar
     * @param  {[type]} currentState [description]
     * @return {[type]}              [description]
     */
    PortalService.getStateChan = function(currentState){
        var stateChan = [];
        stateChan.push(currentState);

        var statePointer = currentState;

        while(statePointer.previous){
            statePointer = $state.get(statePointer.previous);
            stateChan.push(statePointer);
        }
        stateChan.reverse();
        return stateChan;
    };

    /**
     * if given state name is in involved state chan
     * @param  {[type]}  stateName [description]
     * @return {Boolean}           [description]
     */
    PortalService.isActive = function(stateName){
        var stateChan = PortalService.getStateChan($state.current);
        var thisState = $state.get(stateName);
        return stateChan.indexOf(thisState) >- 1;
    };

    PortalService.getPortalNavs = function(){

        var navs = [
            {
                name: 'userManager',
                state: $state.get('app.portal.UserManager'),
                icon: 'fa-user',
                subViews: [
                    {
                        hidden: $rootScope.credential.roleName == 'commUser',
                        name: 'userManager.userList',
                        state: $state.get('app.portal.UserManager.User.UserList')
                    },
                    {
                        name: 'userManager.groupList',
                        state: $state.get('app.portal.UserManager.UserGroup.UserGroupList')
                    }
                ]
            },
            {
                name: 'thingManager.gatewayManagement',
                state: $state.get('app.portal.ThingManager.Gateway'),
                icon: 'fa-desktop'
            },
            {
                name: 'thingViews',
                state: $state.get('app.portal.ThingViews'),
                icon: 'fa-table',
                subViews: [
                    {
                        state: $state.get('app.portal.ThingViews.TypeView'),
                        name: 'thingViews.typeView'
                    },
                    {
                        state: $state.get('app.portal.ThingViews.ControlThing'),
                        name: 'thingViews.controlThings'
                    }
                ]
            },
            {
                name: 'reporting',
                state: $state.get('app.portal.Reporting'),
                icon: 'fa-area-chart',
                subViews: [
                    {
                        name: 'reporting.energyReporting',
                        state: $state.get('app.portal.Reporting.Electricity')
                    },
                    {
                        name: 'reporting.environmentReporting',
                        state: $state.get('app.portal.Reporting.Environment')
                    },
                    {
                        name: 'reporting.densityReporting',
                        state: $state.get('app.portal.Reporting.DensityDetection')
                    },
                    {
                        name: 'reporting.customCharts',
                        state: $state.get('app.portal.Reporting.CustomCharts')
                    }
                ]
            },
            {
                name: 'triggerManager',
                state: $state.get('app.portal.TriggerManager.TriggerList'),
                icon: 'fa-exchange'
            },
            {
                name: 'monitorManager',
                state: $state.get('app.portal.MonitorManager'),
                icon: 'fa-tv'
            },
            {
                name: 'settings',
                state: $state.get('app.portal.Settings'),
                icon: 'fa-cogs'
            }
        ];


        return navs;
    }

    PortalService.navMapping = {
        USRE_MANAGEMENT: 'app.portal.UserManager',
        THING_MANAGEMENT: 'app.portal.ThingManager',
        THING_VIEWS: 'app.portal.ThingViews',
        USER_LIST: 'app.portal.UserManager.User.UserList',
        USER_GROUP: 'app.portal.UserManager.UserGroup.UserGroupList',
        USER_GROUP_EDITOR: 'app.portal.UserManager.UserGroup.UserGroupEdit',
        NEW_USER: 'app.portal.UserManager.User.NewUser',
        USER_INFO: 'app.portal.UserManager.User.UserInfo',
        LOCATION_THING_DETAIL: 'app.portal.ThingViews.LocationThingDetail',
        TYPE_THING_DETAIL: 'app.portal.ThingViews.TypeThingDetail',
        TAG_THING_DETAIL: 'app.portal.ThingViews.TagThingDetail',
        LOCATION_THING_LIST: 'app.portal.ThingViews.LocationThingList',
        TYPE_THING_LIST: 'app.portal.ThingViews.TypeThingList',
        TAG_THING_LIST: 'app.portal.ThingViews.TagThingList',
        USER_THING_AUTH: 'app.portal.UserManager.User.UserThingAuthority',
        USER_THING_ACL: 'app.portal.UserManager.User.UserThingACL',
        GROUP_USER_LIST: 'app.portal.UserManager.UserGroup.GroupUserList',
        GROUP_USER_INFO: 'app.portal.UserManager.UserGroup.UserInfo',
        GROUP_USER_THING_AUTH: 'app.portal.UserManager.UserGroup.GroupUserThingAuthority',
        GROUP_USER_THING_ACL: 'app.portal.UserManager.UserGroup.GroupUserThingACL',
        GROUP_THING_AUTH: 'app.portal.UserManager.UserGroup.GroupThingAuthority',
        GROUP_THING_ACL: 'app.portal.UserManager.UserGroup.GroupThingALC',
        LOCATION_VIEW: 'app.portal.ThingViews.LocationView',
        LOCATHON_THING_ACL: 'app.portal.ThingViews.LocationThingACL',
        TAG_THING_ACL: 'app.portal.ThingViews.TagThingACL',
        TYPE_THING_ACL: 'app.portal.ThingViews.TypeThingACL',
        TAG_VIEW: 'app.portal.ThingViews.TagView',
        TYPE_VIEW: 'app.portal.ThingViews.TypeView',
        SETTINGS: 'app.portal.Settings',
        WELCOME: 'app.portal.Welcome',
        TRIGGER_MANAGEMENT: 'app.portal.TriggerManager'
    };

    return PortalService;
  }])
  .factory('ownership', ['$rootScope', function($rootScope){
    return {
        isCreator: function(obj){
            return(obj.createBy == $rootScope.credential.id)
        }
    };
  }])

  .factory('PermissionControl', ['AppUtils', '$state', function(AppUtils, $state){
    var PermissionControl = {};

    PermissionControl._init = function(){
        PermissionControl.allowedPermissions = AppUtils.getSessionItem(AppTags.PERMISSION)|| [];
    };

    PermissionControl.TagsEnum = {
        'GET_USER': 'GET /users/*',
        'SEARCH_USERS': 'POST /users/simplequery',
        'CREATE_USER': 'POST /users',
        'DELETE_USER': 'DELETE /users/*',
        'UPDATE_USER': 'PATCH /users/*',

        'UPDATE_THIRD_PARTY_USER': 'PATCH /users/*/custom',

        'GET_ALL_GROUPS': 'GET /usergroup/list',
        'GET_GROUP': 'GET /usergroup/*',
        'SERACH_GROUPS': 'POST /usergroup/simplequery*',
        'CREATE_USER_GROUP': 'POST /usergroup',
        'DELETE_USERGROUP': 'DELETE /usergroup/*',
        'ADD_GROUP_MEMBER': 'POST /usergroup/*/user/*',
        'REMOVE_GROUP_MEMBER': 'DELETE /usergroup/*/user/*',
        'BIND_USERGROUP_TAG': 'POST /tags/*/userGroups/*',
        'DELETE_USERGROUP_TAG': 'DELETE /tags/*/userGroups/*',
        'GET_USERGROUP_TAG': 'GET /usergroup/*/tags',


        'SEARCH_TAGS': 'GET /tags/search*',
        'SEARCH_LOCATIONS': 'GET /tags/locations/*',
        'GET_ALL_LOCATIONS': 'GET /tags/locations',
        'SEARCH_TYPES': 'GET /things/types/*',
        'GET_ALL_TYPES': 'GET /things/types',
        'DELETE_TAG': 'DELETE /tags/custom/*',
        'CREATE_TAG': 'POST /tags/custom',

        'BING_TAG': 'POST /things/*/tags/*',
        'BIND_THING_TAG_CUSTOM': 'POST /things/*/tags/custom/*',
        'UNBIND_TAG': 'DELETE /things/*/tags/*',
        'UNBIND_TAG_CUSTOM': 'DELETE /things/*/tags/custom/*',

        'GET_GROUP_PERMISSIONS': 'GET /permission/userGroup/*',
        'GET_ALL_PERMISSIONS': 'GET /permission/list',
        'BIND_PERMISSION': 'POST /permission/*/userGroup/*',
        'UNBIND_PERMISSION': 'DELETE /permission/*/userGroup/*',

        'CREATE_TRIGGER': 'POST /triggers/createTrigger',

        'SEARCH_THINGS': 'GET /things/search*',
        'GET_THING': 'GET /things/*',
        'CREATE_THING': 'POST /things',
        'DELETE_THING': 'DELETE /things/*',
        'SEARCH_THING_TYPES': 'GET /things/types/',
        'GET_TYPE_BY_TAG': 'GET /things/types/tagID/*',

        'DELETE_TRIGGER': 'DELETE /triggers/*',
        'ENABLE_TRIGGER': 'PUT /triggers/*/enable',
        'DISABLE_TRIGGER': 'PUT /triggers/*/disable',
        'GET_TRIGGERS': 'GET /triggers/*'
    };

    PermissionControl.allowedPermissions = [];

    PermissionControl.loadPermissions = function(myPermissions){
        PermissionControl.allowedPermissions = [];
        _.each(myPermissions, function(permission){
            _.each(PermissionControl.TagsEnum, function(value, key){
                if(value == permission){
                    PermissionControl.allowedPermissions.push(key);
                }
            });
        });
        AppUtils.setSessionItem(AppTags.PERMISSION, PermissionControl.allowedPermissions);
    };

    PermissionControl.getAllPermissions = function(){
        PermissionControl.allowedPermissions = [];
        _.each(PermissionControl.TagsEnum, function(value, key){
            PermissionControl.allowedPermissions.push(value);
        });
        PermissionControl.loadPermissions(PermissionControl.allowedPermissions);
    };

    PermissionControl.isAllowed = function(permission){
        if(PermissionControl.allowedPermissions.indexOf(permission)>-1)
            return true;
        return false;
    };

    PermissionControl.allowAction = function (permission, func) {
        if(!PermissionControl.isAllowed(permission)){
            if(_.isFunction(func)){
                func();
            }

            var options = {
                msg: 'app.UNAUTHORIZED_MSG',
                callback: function(){
                    $state.go('app.portal.Welcome');
                }
            };
            AppUtils.alert(options);
            return false;
        }
        return true;
    }

    PermissionControl.destroy = function(){
        PermissionControl.allowedPermissions = [];
        AppUtils.removeSessionItem(AppTags.PERMISSION);
    };


    PermissionControl._init();

    return PermissionControl;
  }]);
