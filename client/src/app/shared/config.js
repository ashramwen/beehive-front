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
    window.MyAPIs = {
        LOGIN: 'app/data/login.json',
        SEARCH_USER: 'app/data/userlist.json'

    };

    /*
     * tag used as session key
     * by George Lin
     */
    var tagPrefix = 'Beehive';
    window.AppTags = {
        USER: tagPrefix + 'USER',

    };
    
})();