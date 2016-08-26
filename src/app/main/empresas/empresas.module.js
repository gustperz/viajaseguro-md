/**
 * Created by Jose Soto Acosta on 25/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.empresas', [
            'app.empresas.gestion_conductores',
            'app.empresas.gestion_vehiculos',
            'app.empresas.gestion_rutas',
            'app.empresas.gestion_centrales'
        ])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider)
    {
        // State
        // $stateProvider
        //     .state('app.centrales', {
        //         url    : '/sample',
        //         views  : {
        //             'content@app': {
        //                 templateUrl: 'app/main/sample/sample.html',
        //                 controller : 'SampleController as vm'
        //             }
        //         }
        //     });

        // Navigation
        msNavigationServiceProvider.saveItem('conductores', {
            title    : 'Conductores',
            icon     : 'icon-tile-four',
            state    : 'app.empresa_conductores',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });

        msNavigationServiceProvider.saveItem('vehiculos', {
            title    : 'Conductores',
            icon     : 'icon-tile-four',
            state    : 'app.empresa_vehiculos',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });

        msNavigationServiceProvider.saveItem('rutas', {
            title    : 'Rutas',
            icon     : 'icon-tile-four',
            state    : 'app.empresa_rutas',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });

        msNavigationServiceProvider.saveItem('centrales', {
            title    : 'Centrales',
            icon     : 'icon-tile-four',
            state    : 'app.empresa_centrales',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });
    }
})();

