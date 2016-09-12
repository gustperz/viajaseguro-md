/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.super_adm.gestion_empresas')
        .controller('GestionEmpresasController', GestionEmpresasController);

    /** @ngInject */
    function GestionEmpresasController(OneRequest) {
        var vm = this;

        // Data
        vm.empresas = null;

        // Methods
        vm.getEmpresas = getEmpresas;
        vm.selectedEmpresa = selectedEmpresa;

        //////////
        function selectedEmpresa(empresa) {
            vm.selected = empresa;
        }

        function getEmpresas() {
            OneRequest.to('empresas/')
                .then(function (data) {
                    vm.empresas = data;
                }, function (error) {
                    console.log(error);
                });
        }

        getEmpresas();
    }
})();

