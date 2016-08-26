(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get('$state');
            $state.go('404');
        });

        $urlRouterProvider.when('/', '/login');

        // State definitions
        $stateProvider
            .state('app', {
                abstract: true,
                views   : {
                    'main@': {
                        templateUrl: 'app/core/layouts/vertical-navigation-fullwidth-toolbar-2.html',
                        controller : 'MainController as vm'
                    },
                    'toolbar@app': {
                        templateUrl: 'app/toolbar/toolbar.html',
                        controller : 'ToolbarController as vm'
                    },
                    'navigation@app': {
                        templateUrl: 'app/navigation/navigation.html',
                        controller : 'NavigationController as vm'
                    },
                    'quickPanel@app': {
                        templateUrl: 'app/quick-panel/quick-panel.html',
                        controller : 'QuickPanelController as vm'
                    }
                }
            });
    }
})();
