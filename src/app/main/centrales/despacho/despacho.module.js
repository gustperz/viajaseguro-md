/**
 * Created by Jose Soto Acosta on 25/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.central_despacho', {
                url: '/central/despacho',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/centrales/despacho/despacho.html',
                        controller: 'DespachoController as vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['CENTRAL_EMPRESA']
                    }
                }
            });

        // Navigation
        msNavigationServiceProvider.saveItem('despacho', {
            title    : 'Despacho de Coonductores',
            icon     : 'icon-account-switch',
            state    : 'app.central_despacho',
            weight:1
        });
    }
})();

