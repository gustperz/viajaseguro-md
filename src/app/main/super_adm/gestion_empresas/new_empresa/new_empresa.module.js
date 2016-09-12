/**
 * Created by Jose Soto Acosta on 11/09/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.super_adm.gestion_empresas.new_empresas', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider
            .state('app.gestion_new_empresa', {
                url: '/super_adm/nueva_empresa',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/super_adm/gestion_empresas/new_empresa/new_empresa.html',
                        controller: 'NewEmpresaController as vm'
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
