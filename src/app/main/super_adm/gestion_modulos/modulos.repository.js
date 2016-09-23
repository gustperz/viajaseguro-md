/**
 * Created by tav0 on 13/09/16.
 */

(function() {
    'use strict';

    angular
        .module('app.super_adm.gestion_empresas')
        .factory('Modulos', factory);

    /* @ngInject */
    function factory(RepositoriesFactory) {

        return new RepositoriesFactory.new('modulos');
    }
})();
