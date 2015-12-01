'use strict';

angular.module('BeehivePortal')
  .controller('PortalController', ['$scope', '$rootScope', '$state', 'AppUtils',function($scope, $rootScope, $state, AppUtils) {
    
    /*
     * objects for generating navigations content on left nav column.
     * by George
     */


    $scope.portalNavs = [
        {
            name: '业主管理',
            icon: '',
            subViews: [
                {
                    name: '业主列表',
                    state: 'app.portal.UserManager.User.UserList',
                    subViews:[{
                        name: '添加用户',
                        state: 'app.portal.UserManager.User.NewUser',
                        hidden: true
                    }],
                    description:'业主管理'
                },
                {
                    name: '群组列表',
                    state: 'app.portal.UserManager.UserGroup.UserGroupList',
                    subViews: []
                }
            ]
        },
        {
            name: '设备管理',
            icon: '',
            subViews: [
                {
                    name: '位置视图',
                    state: 'app.portal.ThingManager.LocationView'
                },
                {
                    name: '种类视图',
                    state: 'app.portal.ThingManager.TypeView'
                },
                {
                    name: '标签视图',
                    state: 'app.portal.ThingManager.TagView'
                }
            ]
        }
    ];

    $scope.otherNavs = {
        NEW_USER_NAV: $scope.portalNavs[0].subViews[0].subViews[0]
    };
    /*
     * Navigation lists
     * currentNav is for state navigated from side menu,
     * extraNavList is for state navigated from other source
     * 
     */
    
    $scope.currentNav = null;

    /*
     * initialize 
     */
    $scope.init = function(){
        _.each($scope.portalNavs, function(nav){
            retrivalSubNavs([nav]);
        });

        _.each($scope.portalNavs,function(nav){
            $scope.currentNav = $scope.currentNav || findNav($state.current.name, nav);
        });

        $scope.navigateTo($scope.currentNav);
        
        function findNav(state,nav){
            var tmpNav = null;
            _.each(nav.subViews,function(subView){
                tmpNav = tmpNav || findNav(state,subView);
            });
            if(tmpNav) return tmpNav;
            return nav.state == state? nav: false;
        }

        function retrivalSubNavs(chan){
            var nav = _.last(chan);
            nav.chan = _.clone(chan);
            _.each(nav.subViews,function(subView){
                retrivalSubNavs(chan.concat([subView]));
            })
        }
    }

    /*
     * when left navs clicked
     */

    $scope.navigateTo = function(nav, notInList){
        if(notInList){
            nav = _.clone(nav);
            nav.chan = _.clone($scope.currentNav.chan);
            nav.chan.push($scope.currentNav);
        }


        var navList = nav.chan||[];

        // uncheck all navs
        _.each($scope.portalNavs,function(subView){
            uncheckAll(subView);
        });

        // check clicked navs
        /*
        var chan = null;
        _.each(nav.subViews,function(subView){
            chan = chan || retrivalSubNavs([subView], nav.state);
        });
        chan = chan || [];
        
        chan = _.uniq(navList.concat(chan));
        */

        _.each(navList,function(navObj){
            navObj._active = true;
        });

        if(!nav.state || nav.state === ""){
            $scope.currentNav._active = true;
            return;
        }

        $scope.currentNav = _.last(navList);
        $state.go(nav.state);

        /*
         * uncheck all highlighted navs
         */
        
        function uncheckAll(navObj){
            navObj._active = false;
            if(navObj.subViews){
                _.each(navObj.subViews,function(subView){
                    uncheckAll(subView);
                })
            }
        }


        /*
         * retrival sub navs of clicked nav
         */
        function retrivalSubNavs(chan, selectedState){
            var obj = chan[chan.length - 1];
            if(obj.state === selectedState) return chan;
            if(!obj.subViews || obj.subViews.length==0) return false;

            var foundChan = false;
            _.each(obj.subViews,function(subViewObj){
                var subChan = _.clone(chan).push(subViewObj);
                foundChan = foundChan || retrivalSubNavs(obj,subViewObj);
            });
            return foundChan;
        }

    };


  }]);
