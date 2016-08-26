(function ()
{
    'use strict';

    angular
        .module('app.auth.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider
            .state('app.login', {
                url    : '/login',
                views  : {
                    'main@': {
                        templateUrl: 'app/core/layouts/content-only.html',
                        controller : 'MainController as vm'
                    },
                    'content@app.login': {  // Target the `content` that I overrode within this state
                        templateUrl: 'app/auth/login/login.html',
                        controller : 'LoginController as vm'
                    }
                },
                bodyClass: 'login'
            });
    }

})();