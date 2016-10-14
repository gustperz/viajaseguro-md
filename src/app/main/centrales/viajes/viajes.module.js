/**
 * Created by jose on 14/10/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.viajes', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.central_viajes', {
                url: '/central/viajes',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/centrales/viajes/viajes.html',
                        controller: 'ViajesController as vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['CENTRAL_EMPRESA']
                    }
                }
            });

        // Navigation
        msNavigationServiceProvider.saveItem('viajes', {
            title    : 'Viajes',
            icon     : 'icon-taxi',
            state    : 'app.central_viajes',
            weight:1
        });
    }
})();
