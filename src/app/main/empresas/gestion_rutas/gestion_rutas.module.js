/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.gestion_rutas', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider
            .state('app.empresa_rutas', {
                url: '/empresa/rutas',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/empresas/gestion_rutas/rutas.html',
                        controller: 'EmpresaRutasController as vm'
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
