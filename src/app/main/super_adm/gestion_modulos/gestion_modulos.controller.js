/**
 * Created by Jose Soto Acosta on 22/09/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.super_adm.gestion_modulos')
        .controller('GestionModulosController', GestionModulosController);

    /** @ngInject */
    function GestionModulosController(Modulos, Toast) {
        var vm = this;
        var campos = 'nombre';

        vm.modulos = [];
        vm.selected = {};

        vm.selectedModulo = selectedModulo;
        vm.newModalModulo = newModalModulo;

        getModulos();


        function newModalModulo(ev, tipo) {
            Toast('Esta funcion se encuentra deshabilitada temporalmente.')
        }

        function selectedModulo(modulo, $index) {
            vm.selected = modulo;
            vm.index = $index;
        }


        function getModulos() {
            Modulos.getList({fields: campos}).then(success, error);

            function success(response) {
                vm.modulos = response;
                vm.selected = vm.modulos[0];
            }

            function error(response) {
                console.log(response);
            }
        }
    }
})();
