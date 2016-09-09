/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.super_adm.gestion_empresas', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider
            .state('app.gestion_empresas', {
                url: '/super_adm/empresas',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/super_adm/gestion_empresas/gestion_empresas.html',
                        controller: 'GestionEmpresasController as vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['SUPER_ADM']
                    }
                }
            });
    }
})();