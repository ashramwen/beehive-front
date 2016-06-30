/*
 * configuration file for application
 * mostly constants used globally
 * created by George Lin @ Kii
 */

(function () {
    var siteUrl = appConfig[appConfig.ENV].siteUrl;
    window.thirdPartyAPIUrl = appConfig[appConfig.ENV].thirdPartyAPIUrl;
    var cloudUrl = appConfig[appConfig.ENV].cloudUrl;
    /*
     * API used globally for web service
     * by George Lin
     */

    var apiSuffix = siteUrl + '/beehive-portal/api';

    window.MyAPIs = {
        OPERATOR: '/oauth2',
        USER:'/users',
        USER_MANAGER: '/usermanager',
        USER_GROUP:'/usergroup',
        THING:'/things',
        TAG: '/tags',
        TYPE: '/things/types',
        PERMISSION: '/permission',
        TRIGGER: '/triggers',
        THING_IF: '/thing-if',
        ONBOARDING: '/onboardinghelper',
        SUPPLIER: '/devicesuppliers',
        SYSTEM_PERMISSION: '/sys/permissionTree',
        USER_SYNC: '/usersync'
    };

    /*
     * init api urls
     */
    for(apiName in window.MyAPIs){
        window.MyAPIs[apiName] = apiSuffix +  window.MyAPIs[apiName];
    }

    window.MyAPIs['SCHEMA'] = siteUrl + '/demohelper/api/industrytemplate';
    window.MyAPIs['CLOUD_THING_IF'] = cloudUrl + '/thing-if';
    window.webSocketPath =  appConfig[appConfig.ENV].wsUrl;
    
    /*
     * tag used as session key
     * by George Lin
     */
    var tagPrefix = 'Beehive';
    window.AppTags = {
        USER: tagPrefix + 'USER',
        PERMISSION: tagPrefix + 'PERMISSION'
    };

    window.pageListMaxLength = 20;
    window.siteUrl = siteUrl;
    
})();