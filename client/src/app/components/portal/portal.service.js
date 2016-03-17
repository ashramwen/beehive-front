angular.module('BeehivePortal')
  .factory('PortalService', ['$http', '$q', 'Session', '$state', 'PermissionControl', function($http, $q, Session, $state, PermissionControl) {
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
        return [
            {
                name: '用户管理',
                state: $state.get('app.portal.UserManager'),
                icon: 'fa-user',
                subViews: [
                    {
                        name: '用户列表',
                        state: $state.get('app.portal.UserManager.User.UserList'),
                        hidden: !PermissionControl.isAllowed('GET_USER')
                    },
                    {
                        name: '群组列表',
                        state: $state.get('app.portal.UserManager.UserGroup.UserGroupList')
                    }
                ]
            },
            {
                name: '设备管理',
                state: $state.get('app.portal.ThingManager'),
                hidden: !PermissionControl.isAllowed('SEARCH_LOCATIONS') 
                    && !PermissionControl.isAllowed('SEARCH_TAGS') 
                    && !PermissionControl.isAllowed('SEARCH_TYPE'),
                icon: 'fa-desktop',
                subViews: [
                    {
                        name: '添加新设备',
                        state: $state.get('app.portal.ThingManager.AddThing')
                    },
                    {
                        name: '网关管理',
                        state: $state.get('app.portal.ThingManager.Gateway')
                    },
                    {
                        name: '控制设备',
                        state: $state.get('app.portal.ThingManager.ControlThing')
                    }
                ]
            },
            {
                name: '设备视图',
                state: $state.get('app.portal.ThingViews'),
                hidden: !PermissionControl.isAllowed('SEARCH_LOCATIONS') 
                    && !PermissionControl.isAllowed('SEARCH_TAGS') 
                    && !PermissionControl.isAllowed('SEARCH_TYPE'),
                icon: 'fa-table',
                subViews: [
                    {
                        name: '位置视图', 
                        state: $state.get('app.portal.ThingViews.LocationView'), 
                        hidden: !PermissionControl.isAllowed('SEARCH_LOCATIONS')
                    },
                    {
                        name: '标签视图', 
                        state: $state.get('app.portal.ThingViews.TagView'), 
                        hidden: !PermissionControl.isAllowed('SEARCH_TAGS')
                    },
                    {
                        name: '种类视图', 
                        state: $state.get('app.portal.ThingViews.TypeView'),
                        hidden: !PermissionControl.isAllowed('SEARCH_TYPES')
                    }
                ]
            },
            {
                name: '触发器管理',
                state: $state.get('app.portal.TriggerManager'),
                icon: 'fa-exchange'
            },
            {
                name: '设置',
                state: $state.get('app.portal.Settings'),
                icon: 'fa-cogs'
            }
        ];
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

        'GET_ALL_GROUPS': 'GET /usergroup/list',
        'GET_GROUP': 'GET /usergroup/*',
        'SERACH_GROUPS': 'POST /usergroup/simplequery*', 
        'CREATE_USER_GROUP': 'POST /usergroup', 
        'DELETE_USERGROUP': 'DELETE /usergroup/*',
        'ADD_GROUP_MEMBER': 'POST /usergroup/*/user/*',
        'REMOVE_GROUP_MEMBER': 'DELETE /usergroup/*/user/*',

        'SEARCH_TAGS': 'GET /tags/search*',
        'SEARCH_LOCATIONS': 'GET /tags/locations/*',
        'GET_ALL_LOCATIONS': 'GET /tags/locations',
        'SEARCH_TYPES': 'GET /things/types/*',
        'GET_ALL_TYPES': 'GET /things/types',

        'BING_TAG': 'POST /things/*/tags/*',
        'UNBIND_TAG': 'DELETE /things/*/tags/*', 

        'GET_GROUP_PERMISSIONS': 'GET /permission/userGroup/*', 
        'GET_ALL_PERMISSIONS': 'GET /permission/list', 
        'BIND_PERMISSION': 'POST /permission/*/userGroup/*',
        'UNBIND_PERMISSION': 'DELETE /permission/*/userGroup/*',

        'CREATE_TRIGGER': 'POST /triggers/createTrigger',

        'SEARCH_THINGS': 'GET /things/search*',
        'GET_THING': 'GET /things/*'
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
            AppUtils.alert('对不起，您没有该资源的访问权限，请联系管理员或尝试重新登录！', '没有访问权限', function(){
                $state.go('app.portal.Welcome');
            });
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
