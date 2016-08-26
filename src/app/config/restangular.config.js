(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig(RestangularProvider, api)
    {
        RestangularProvider.setBaseUrl(api);

    }
})();
