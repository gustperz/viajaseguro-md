/**
 * Created by Jose Soto Acosta on 25/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.central_despacho', {
                url: '/central/despacho',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/centrales/despacho/despacho.html',
                        controller: 'DespachoController as vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['CENTRAL_EMPRESA']
                    }
                }
            })
            .state('app.central_despacho_nomenu', {
                url: '/despacho_conductores',
                views: {
                    'main@': {
                        templateUrl: 'app/core/layouts/content-with-toolbar.html',
                        controller : 'MainController as vm'
                    },

                    'toolbar@app.central_despacho_nomenu': {
                        templateUrl: 'app/toolbar/toolbar2.html',
                        controller : 'ToolbarController as vm'
                    },
                    'content@app.central_despacho_nomenu': {
                        templateUrl: 'app/main/centrales/despacho/despacho.html',
                        controller: 'DespachoController as vm'
                    },
                },
                data: {
                    permissions: {
                        only: ['DESPACHADOR_EMPRESA']
                    }
                }
            });

        // Navigation
        msNavigationServiceProvider.saveItem('despacho', {
            title    : 'Despacho de Coonductores',
            icon     : 'icon-account-switch',
            state    : 'app.central_despacho',
            weight:1
        });
    }
})();

