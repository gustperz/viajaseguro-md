(function ()
{
    'use strict';

    angular
        .module('app.auth', [
            'permission', 'permission.ui',
            'app.auth.login'
        ])
        .config(config);

    /** @ngInject */
    function config()
    {
        
    }

})();