(function ()
{
    'use strict';

    angular
        .module('app.auth', [
            'permission', 'permission.ui', 'angular-jwt', 'app.constansts',
            'app.auth.login'
        ])
        .config(config);

    /** @ngInject */
    function config()
    {

    }

})();
