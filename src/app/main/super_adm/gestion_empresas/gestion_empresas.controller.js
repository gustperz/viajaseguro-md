/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.super_adm.gestion_empresas')
        .controller('GestionEmpresasController', GestionEmpresasController);

    /** @ngInject */
    function GestionEmpresasController(OneRequest, $mdDialog, Toast) {
        var vm = this;

        // Data
        vm.empresas = null;

        // Methods
        vm.getEmpresas = getEmpresas;
        vm.selectedEmpresa = selectedEmpresa;
        vm.newModalEmpresa = newModalEmpresa;
        vm.deleteEmpresa = deleteEmpresa;

        //////////
        function selectedEmpresa(empresa, $index) {
            vm.selected = empresa;
            vm.index = $index;
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
                    if (response.code == "OK" || response.code == "ok") {
                        if (response.tipo == 'Nueva') {
                            vm.empresas.push(response.data);
                        }
                        Toast(response.mensaje, 'bottom right')
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
                OneRequest.delete('empresas/'+vm.selected.id).then(success, error)
                function success(response) {
                    vm.empresas.splice(vm.index, 1);
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
            OneRequest.to('empresas/').then(success, error)
            function success(response) {
                vm.empresas = response;
                vm.selected = vm.empresas[0];
            }

            function error(response) {
                console.log(response);
            }

        }

        getEmpresas();
    }
})();

