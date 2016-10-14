/**
 * Created by tav0 on 13/09/16.
 */

(function() {
    'use strict';

    angular
        .module('app.centrales.viajes')
        .factory('Viajes', factory);

    /* @ngInject */
    function factory(RepositoriesFactory) {

        return new RepositoriesFactory.new('viajes');
    }
})();
