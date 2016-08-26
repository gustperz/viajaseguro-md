/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.gestion_conductores', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider
            .state('app.empresa_conductores', {
                url: '/empresa/conductores',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/empresas/gestion_conductores/conductores.html',
                        controller: 'EmpresaConductoresController as vm'
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
