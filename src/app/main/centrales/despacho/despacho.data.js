/**
 * Created by tav0 on 26/09/16.
 */

(function() {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .factory('Despacho', factory);

    /* @ngInject */
    function factory() {
        return {
            origen: undefined,
            destino: undefined,
            conductor: undefined,
            sa: {},
            sp: []
        };
    }
})();