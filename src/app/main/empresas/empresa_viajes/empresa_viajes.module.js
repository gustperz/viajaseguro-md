/**
 * Created by jose on 14/10/16.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.viajes2', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider
            .state('app.empresa_viajes', {
                url: '/empresa/viajes',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/empresas/empresa_viajes/empresa_viajes.html',
                        controller: 'EmpresaViajesController as vm'
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
