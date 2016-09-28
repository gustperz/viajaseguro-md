/**
 * Created by jose on 25/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.auth.perfil', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        $stateProvider
            .state('app.empresa_perfil', {
                url: '/empresa/perfil',
                views: {
                    'content@app': {
                        templateUrl: 'app/auth/perfil/perfil.html',
                        controller: 'PerfilController as vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['EMPRESA']
                    }
                },
                bodyClass: 'profile'
            });
    }
})();

