/*
 * configuration file for application
 * mostly constants used globally
 * created by George Lin @ Kii
 */

(function() {
    var siteUrl = appConfig[appConfig.ENV].siteUrl;
    window.AppConfig = appConfig[appConfig.ENV];
    window.thirdPartyAPIUrl = appConfig[appConfig.ENV].thirdPartyAPIUrl;
    var cloudUrl = appConfig[appConfig.ENV].cloudUrl;
    /*
     * API used globally for web service
     * by George Lin
     */

    var apiSuffix = siteUrl + '/api';

    window.MyAPIs = {
        'INDUSTRYTEMPLATE': '/industrytemplate',
        'LOCATION_TAGS': '/locationTags',
        'ONBOARDING': '/onboardinghelper',
        'OPERATOR': '/oauth2',
        'PERMISSION': '/permission',
        'REPORTS': '/reports',
        'SCHEMA': '/schema',
        'SUPPLIER': '/devicesuppliers',
        'SYSTEM_PERMISSION': '/sys/permissionTree',
        'TAG': '/tags',
        'THING': '/things',
        'THING_IF': '/thing-if',
        'TRIGGER': '/triggers',
        'TYPE': '/things/types',
        'USER': '/users',
        'USER_GROUP': '/usergroup',
        'USER_MANAGER': '/usermanager',
        'USER_SYNC': '/usersync'
    };


    /*
     * init api urls
     */
    for (var apiName in window.MyAPIs) {
        window.MyAPIs[apiName] = apiSuffix + window.MyAPIs[apiName];
    }

    window.MyAPIs['CLOUD_THING_IF'] = cloudUrl + '/thing-if';
    window.webSocketPath = appConfig[appConfig.ENV].wsUrl;

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