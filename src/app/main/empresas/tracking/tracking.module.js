/**
 * Created by jose on 25/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.tracking', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        $stateProvider
            .state('app.tracking', {
                url: '/tracking',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/empresas/tracking/tracking.html',
                        controller: 'TrackingController as vm'
                    }
                },
                data: {
                    permissions: {
                        only: ['EMPRESA', 'CENTRAL_EMPRESA']
                    }
                }
            });
    }
})();

