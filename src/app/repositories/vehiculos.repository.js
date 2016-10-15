/**
 * Created by Jose Soto on 19/09/16.
 */

(function() {
    'use strict';

    angular
        .module('app.repositories')
        .factory('Vehiculos', factory);

    /* @ngInject */
    function factory(RepositoriesFactory) {

        return new RepositoriesFactory.new('vehiculos');
    }
})();
