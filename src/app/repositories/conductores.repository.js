/**
 * Created by tav0 on 13/09/16.
 */

(function() {
    'use strict';

    angular
        .module('app.repositories')
        .factory('Conductores', factory);

    /* @ngInject */
    function factory(RepositoriesFactory) {

        return new RepositoriesFactory.new('conductores');
    }
})();
