/**
 * Created by Jose Soto Acosta on 22/09/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.super_adm.gestion_modulos', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider
            .state('app.gestion_modulos', {
                url: '/super_adm/modulos',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/super_adm/gestion_modulos/gestion_modulos.html',
                        controller: 'GestionModulosController as vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['SUPER_ADM']
                    }
                },
                bodyClass: 'gestion_modulos'
            });
    }
})();
