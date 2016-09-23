/**
 * Created by Jose Soto Acosta on 25/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.super_adm', [
            'app.super_adm.gestion_empresas',
            'app.super_adm.gestion_modulos'
        ])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('empresas', {
            title    : 'Gestion Empresas',
            icon     : 'icon-store',
            state    : 'app.gestion_empresas',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });

        msNavigationServiceProvider.saveItem('modulos', {
            title    : 'Gestion Modulos',
            icon     : 'icon-clipboard-text',
            state    : 'app.gestion_modulos',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });
    }
})();

