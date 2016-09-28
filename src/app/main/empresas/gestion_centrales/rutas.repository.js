/**
 * Created by tav0 on 13/09/16.
 */

(function() {
    'use strict';

    angular
        .module('app.empresas.gestion_conductores')
        .factory('Rutas', factory);

    /* @ngInject */
    function factory(AbstractRepository) {
        function Repository() {
            AbstractRepository.call(this, 'rutas');
        }

        AbstractRepository.extend(Repository);

        Repository.prototype.get = function (id) {
            return this.restangular.restangularizeElement(null, {id:id}, this.route);
        }

        return new Repository();
    }
})();
