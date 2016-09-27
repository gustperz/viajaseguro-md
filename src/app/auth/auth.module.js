(function ()
{
    'use strict';

    angular
        .module('app.auth', [
            'permission', 'permission.ui', 'angular-jwt', 'app.constansts',
            'app.auth.login',
            'app.auth.perfil'
        ])
        .config(config);

    /** @ngInject */
    function config()
    {

    }

})();
