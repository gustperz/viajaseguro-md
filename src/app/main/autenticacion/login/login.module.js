(function ()
{
    'use strict';

    angular
        .module('app.autenticacion.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        // State
        $stateProvider.state('app.autenticacion_login', {
            url      : '/autenticacion/login',
            views    : {
                'main@'                          : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.autenticacion_login': {
                    templateUrl: 'app/main/autenticacion/login/login.html',
                    controller : 'LoginController as vm'
                }
            },
            data  : {
              noRequiresLogin: true
            },
            bodyClass: 'login'
        });
    }
})();
