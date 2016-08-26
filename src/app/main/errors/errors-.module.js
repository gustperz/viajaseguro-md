(function ()
{
    'use strict';

    angular
        .module('app.errors', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        // State
        $stateProvider
            .state('500', {
                parent: 'app',
                url: '/500',
                views: {
                    'main@': {
                        templateUrl: 'app/core/layouts/content-only.html',
                        controller : 'MainController as vm'
                    },
                    'content@500': {
                        templateUrl: 'app/main/errors/error-500.html'
                    }
                },
                bodyClass: 'error-500'
            })
            .state('404', {
                parent: 'app',
                url: '/404',
                views: {
                    'main@': {
                        templateUrl: 'app/core/layouts/content-only.html',
                        controller : 'MainController as vm'
                    },
                    'content@404': {
                        templateUrl: 'app/main/errors/error-404.html'
                    }
                },
                bodyClass: 'error-404'
            })
            .state('401', {
                parent: 'app',
                url: '/401',
                views: {
                    'main@': {
                        templateUrl: 'app/core/layouts/content-only.html',
                        controller : 'MainController as vm'
                    },
                    'content@401': {
                        templateUrl: 'app/main/errors/error-401.html'
                    }
                }
            });
    }

})();