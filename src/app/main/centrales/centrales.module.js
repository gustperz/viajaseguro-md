/**
 * Created by Jose Soto Acosta on 25/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.centrales', [
            'angular-toArrayFilter',
            'app.centrales.despacho',
            'app.centrales.conductores',
            'app.centrales.viajes'
        ])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {

    }
})();
