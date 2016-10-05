/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .factory('SolicitudesData', factory);

    /* @ngInject */
    function factory() {
        return {
            solicitudes: undefined,
            solicitudes_asiganadas: {}
        };
    }
})();

