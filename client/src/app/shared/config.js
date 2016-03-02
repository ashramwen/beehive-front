/*
 * configuration file for application
 * mostly constants used globally
 * created by George Lin @ Kii
 */

(function () {
    
    /*
     * API used globally for web service
     * by George Lin
     */
    var apiSuffix ='http://114.215.196.178:8080/beehive-portal/api';
    window.MyAPIs = {
        OPERATOR: '/oauth2',
        USER:'/users',
        USER_GROUP:'/usergroup',
        THING:'/things',
        TAG: '/tags',
        TYPE: '/things/types',
        PERMISSION: '/permission',
        TRIGGER: '/trigger',
    };

    /*
     * init api urls
     */
    for(apiName in window.MyAPIs){
        window.MyAPIs[apiName] = apiSuffix +  window.MyAPIs[apiName];
    }

    /*
     * for temp use
     */
    window.MyAPIs.LOGIN = 'app/data/login.json';

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
    
})();