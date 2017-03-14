(function() {
    window.appConfig = {
        "DEV": {
            "cloudUrl": "http://api-development-beehivecn3.internal.kii.com",
            "wsUrl": "ws://114.215.196.178:8080/beehive-portal/websocket/stomp",
            "siteUrl": "http://114.215.196.178:8080/beehive-portal",
            "kiiAppID": "192b49ce",
            "thirdPartyAPIUrl": "http://114.215.196.178:8081/3rdpartyapiserver/app/api_inquiry/apilist.html?vendor=Beehive"
        },
        "QA": {
            "cloudUrl": "http://api-development-beehivecn3.internal.kii.com",
            "wsUrl": "ws://114.215.178.24:8080/beehive-portal/websocket/stomp",
            "siteUrl": "http://114.215.178.24:8080/beehive-portal",
            "kiiAppID": "493e83c9",
            "thirdPartyAPIUrl": "http://114.215.178.24:9081/index.html"
        },
        "LOCAL": {
            "cloudUrl": "http://api-development-beehivecn3.internal.kii.com",
            "wsUrl": "ws://localhost:9090/beehive-portal/websocket/stomp",
            "siteUrl": "http://localhost:9090/beehive-portal",
            "thirdPartyAPIUrl": "http://114.215.178.24:8081/3rdpartyapiserver/app/api_inquiry/apilist.html?vendor=Beehive"
        },
        "PRODUCTION": {
            "cloudUrl": "https://api-beehivecn4.kii.com",
            "wsUrl": "ws://120.77.83.143:8080/beehive-portal/websocket/stomp",
            "siteUrl": "http://120.77.83.143:8080/beehive-portal",
            "thirdPartyAPIUrl": "http://120.77.83.143:9082/cn/guide"
        },
        "ENV": "DEV",
        "version": '1.0'
    };
})();