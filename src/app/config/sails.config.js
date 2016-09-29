/**
 * Created by jose on 28/09/16.
 */
(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($sailsProvider, api)
    {
        $sailsProvider.url = api;
    }
})();

