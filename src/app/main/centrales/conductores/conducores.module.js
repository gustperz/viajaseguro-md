/**
 * Created by Jose Soto Acosta on 25/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.conductores', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider
            .state('app.central_conductores', {
                url: '/central/conductores',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/centrales/conductores/conductores.html',
                        controller: 'CentralConductoresController as vm'
                    }
                },
                data: {
                    onlyAccess: ['CENTRAL_EMPRESA']
                }
            });
    }
})();

