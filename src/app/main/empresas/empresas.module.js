/**
 * Created by Jose Soto Acosta on 25/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.empresas', [
            'angular-toArrayFilter',
            'app.empresas.gestion_conductores',
            'app.empresas.gestion_vehiculos',
            'app.empresas.gestion_centrales',
            'app.empresas.perfil',
            'app.tracking',
            'app.empresas.viajes2'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('centrales', {
            title    : 'Centrales',
            icon     : 'icon-store',
            state    : 'app.empresa_centrales',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });

        msNavigationServiceProvider.saveItem('conductores', {
            title    : 'Conductores',
            icon     : 'icon-account-location',
            state    : 'app.empresa_conductores',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });

        msNavigationServiceProvider.saveItem('vehiculos', {
            title    : 'Vehiculos',
            icon     : 'icon-taxi',
            state    : 'app.empresa_vehiculos',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });

        msNavigationServiceProvider.saveItem('tracking', {
            title    : 'Mapa',
            icon     : 'icon-map-marker-radius',
            state    : 'app.tracking',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });

        msNavigationServiceProvider.saveItem('Viajes', {
            title    : 'Viajes',
            icon     : 'icon-taxi',
            state    : 'app.empresa_viajes',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });
    }
})();

