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
    function config($stateProvider)
    {
        // State
        $stateProvider
            .state('app.sample', {
                url    : '/sample',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/sample/sample.html',
                        controller : 'SampleController as vm'
                    }
                }
            });
    }
})();
