(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, api, jwtOptionsProvider)
    {
        var jwt = sessionStorage.getItem('jwt');
        // config restangular
        RestangularProvider.setBaseUrl(api);
        jwtOptionsProvider.config({ whiteListedDomains: ['http://dev.viajaseguro.co'] });
        // RestangularProvider.setDefaultHeaders({Authorization : 'Bearer '+ jwt});
        //
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get('$state');
            return $state.go('app.autenticacion_login');
        });
        // $urlRouterProvider.otherwise(function($injector) {
        //     var $state = $injector.get('$state');
        //     return $state.go('app.pages_autenticacion_login');
        // });

        // $urlRouterProvider.otherwise('/autenticacion/login');

        // State definitions
        $stateProvider
            .state('app', {
                abstract: true,
                views   : {
                    'main@'         : {
                        templateUrl: 'app/core/layouts/vertical-navigation-fullwidth-toolbar-2.html',
                        controller : 'MainController as vm'
                    },
                    'toolbar@app'   : {
                        templateUrl: 'app/toolbar/toolbar.html',
                        controller : 'ToolbarController as vm'
                    },
                    'navigation@app': {
                        templateUrl: 'app/navigation/navigation.html',
                        controller : 'NavigationController as vm'
                    },
                }
            });
    }
})();
