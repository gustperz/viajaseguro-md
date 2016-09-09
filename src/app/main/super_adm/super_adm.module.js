/**
 * Created by Jose Soto Acosta on 25/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.super_adm', [
            'app.super_adm.gestion_empresas',
        ])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('empresas', {
            title    : 'Gestion Empresas',
            icon     : 'icon-tile-four',
            state    : 'app.gestion_empresas',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });
    }
})();

