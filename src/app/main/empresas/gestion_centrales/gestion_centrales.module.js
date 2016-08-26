/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.gestion_centrales', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider
            .state('app.empresa_centrales', {
                url: '/empresa/centrales',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/empresas/gestion_centrales/centrales.html',
                        controller: 'EmpresaCentralesController as vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['EMPRESA']
                    }
                }
            });
    }
})();