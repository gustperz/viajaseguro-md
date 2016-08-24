(function ()
{
    'use strict';

    angular
        .module('app.sample', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider)
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

        // Navigation
        msNavigationServiceProvider.saveItem('fuse', {
            title    : 'Conductores',
            icon     : 'icon-tile-four',
            state    : 'app.sample',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });
        msNavigationServiceProvider.saveItem('fuse2', {
            title    : 'Despacho de Coonductores',
            icon     : 'icon-tile-four',
            state    : 'app.sample2',
            /*stateParams: {
             'param1': 'page'
             },*/
            weight:1
        });
    }
})();