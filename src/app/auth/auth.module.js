(function ()
{
    'use strict';

    angular
        .module('app.auth', [
            'permission', 'permission.ui', 'angular-jwt', 'app.constansts',
            'auth.login'
        ])
        .config(config);

    /** @ngInject */
    function config()
    {

    }

})();
