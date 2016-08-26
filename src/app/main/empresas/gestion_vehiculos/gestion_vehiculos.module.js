/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.gestion_vehiculos', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider
            .state('app.empresa_vehiculos', {
                url: '/empresa/vehiculos',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/empresas/vehiculos/vehiculos.html',
                        controller: 'EmpresaVehiculosController as vm'
                    }
                },
                data: {
                    onlyAccess: ['EMPRESA']
                }
            });
    }
})();
