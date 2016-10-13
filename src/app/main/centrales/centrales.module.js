/**
 * Created by Jose Soto Acosta on 25/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.centrales', [
            'app.centrales.despacho',
            'app.centrales.conductores'
        ])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {

    }
})();
