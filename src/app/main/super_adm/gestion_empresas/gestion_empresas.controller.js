/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.super_adm.gestion_empresas')
        .controller('GestionEmpresasController', GestionEmpresasController);

    /** @ngInject */
    function GestionEmpresasController(Empresas, $mdDialog, Toast, $mdSidenav) {
        var vm = this;

        // Data
        vm.empresas = null;

        // Methods
        vm.getEmpresas = getEmpresas;
        vm.selectedEmpresa = selectedEmpresa;
        vm.newModalEmpresa = newModalEmpresa;
        vm.deleteEmpresa = deleteEmpresa;
        vm.abrirPanel = abrirPanel;

        //////////

        getEmpresas();

        //////////

        function selectedEmpresa(empresa, $index) {
            vm.selected = empresa;
            vm.index = $index;
        }

        function abrirPanel(empresa, $index) {
            vm.selected = empresa;
            vm.index = $index;
            toggleSidenav('details-sidenav');
        }

        function toggleSidenav(sidenavId){
            $mdSidenav(sidenavId).toggle();
        }

        function newModalEmpresa(ev, tipo) {
            $mdDialog.show({
                locals: {
                    tipo: tipo,
                    empresa: vm.selected
                },
                controller: NewEmpresaController,
                controllerAs: 'vm',
                templateUrl: 'app/main/super_adm/gestion_empresas/new_empresa/new_empresa.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false
            })
                .then(function (response) {
                    console.log(response);
                    if (response.metadata.code == "OK" || response.metadata.code == "ok") {
                        if (response.metadata.tipo == 'Nueva') {
                            vm.empresas.push(response);
                        }
                        Toast(response.metadata.mensaje, 'bottom right')
                    }
                }, function (reponse) {

                });
        }

        function deleteEmpresa(ev) {
            var confirm = $mdDialog.confirm()
                .title('Estas seguro que deseas eliminar esta empresa?')
                .textContent('Tendras que volver a digitar sus datos para crearla.')
                .ariaLabel('No lo creo')
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('Continuar!')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function() {
                vm.selected.remove().then(success, error)
                function success(response) {
                    vm.empresas.splice(vm.index, 1);
                    if (vm.empresas.length > 0) {
                        vm.selected = vm.empresas[0];
                    }else{
                        vm.selected = null;
                    }
                    Toast('Empresa eliminada correctamente');
                }
                function error(response) {
                    console.log(response);
                }
            }, function() {
                console.log('Menos mal')
            });
        }

        function getEmpresas() {
            var campos = 'nit, nombre_corto, direccion, telefono, activa, logo, nombre_largo, tipo';
            Empresas.getList({fields: campos}).then(success, error)
            function success(response) {
                vm.empresas = response;
                vm.selected = vm.empresas[0];
            }

            function error(response) {
                console.log(response);
            }

        }
    }
})();

