/**
 * Created by tav0 on 26/09/16.
 */

(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('FloatingFormController', FloatingFormController);

    /** @ngInject */
    function FloatingFormController(OneRequest, $mdMenu){
        var vm = this;
        vm.centrales = [];

        vm.querySearch = querySearch;
        vm.loadCiudades = loadCiudades;
        vm.cancel = cancel;

        loadDepartamentos();

        //////////

        function loadDepartamentos() {
            OneRequest.to('/departamentos', null, true).then(function (departamentos) {
                vm.departamentos = departamentos;
            })
        }

        function loadCiudades(departamento) {
            OneRequest.to('/ciudades', {'departamento': departamento}, true).then(function (ciudades) {
                vm.ciudades = ciudades;
            });
        }

        function querySearch (query, collection) {
            var results = query ? collection.filter( createFilterFor(query) ) : collection;
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function(item) {
                return (angular.lowercase(item.nombre).indexOf(lowercaseQuery) != -1);
            };

        }

        function cancel() {
            vm.selectedCiudad = '';
            vm.selectedCentral = '';
            vm.searchText = '';
            vm.searchTextD = '';
            vm.trayecto_ruta = '';
            $mdMenu.hide()
        }
    }
})();
