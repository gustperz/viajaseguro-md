/**
 * Created by Jose Soto Acosta on 25/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.centrales', [
            'app.centrales.conductores',
            'app.centrales.despacho'
        ])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.centrales', {
                url    : '/sample',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/sample/sample.html',
                        controller : 'SampleController as vm'
                    }
                }
            });

        // Navigation
        msNavigationServiceProvider.saveItem('despacho', {
            title    : 'Despacho de Coonductores',
            icon     : 'icon-tile-four',
            state    : 'app.central_despacho',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });

        msNavigationServiceProvider.saveItem('conductores', {
            title    : 'Conductores',
            icon     : 'icon-tile-four',
            state    : 'app.central_conductores',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });
    }
})();
