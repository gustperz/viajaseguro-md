/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.gestion_conductores')
        .controller('EmpresaConductoresController', EmpresaConductoresController);

    /** @ngInject */
    function EmpresaConductoresController(Conductores, $mdSidenav, $mdDialog, $filter) {
        var vm = this;
        var campos = 'identificacion, nombres, apellidos, direccion,' +
            ' telefono, activo, imagen, fecha_licencia, fecha_seguroac, vehiculo,' +
            ' vehiculo.fecha_tecnomecanica, vehiculo.fecha_soat';
        vm.conductores = [];
        vm.conductoresInactivos = [];
        vm.selected = {};
        vm.n_cond_doc_venc = 0;

        // Methods
        vm.selectedConductor = selectedConductor;
        vm.abrirPanel = abrirPanel;
        vm.toggleSidenav = toggleSidenav;

        vm.newModalConductor = newModalConductor;
        vm.deleteConductor = deleteConductor;
        //////////
        getConductores();
        /////////
        function selectedConductor(conductor, $index) {
            vm.selected = conductor;
            vm.index = $index;
        }

        function abrirPanel(empresa, $index) {
            vm.selected = empresa;
            vm.index = $index;
            toggleSidenav('details-sidenav');
        }

        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

        function getConductores() {
            Conductores.getList({fields: campos})
                .then(function (data) {
                    data.forEach(function (conductor) {
                        if (conductor.activo === true) {
                            conductor.doc_venc = documentacionPorVencer(conductor);
                            vm.conductores.push(conductor);
                        } else {
                            vm.conductoresInactivos.push(conductor);
                        }
                    });
                    vm.selected = vm.conductores[0];
                }, function (error) {
                    console.log(error);
                });
        }

        //////////

        function documentacionPorVencer(conductor) {
            const fecha_licencia = conductor.fecha_licencia ? new Date(conductor.fecha_licencia) : null;
            const fecha_seguroac = conductor.fecha_seguroac ? new Date(conductor.fecha_seguroac) : null;
            const fecha_soat = conductor.vehiculo.fecha_soat ? new Date(conductor.vehiculo.fecha_soat) : null;
            const fecha_tecnomecanica = conductor.vehiculo.fecha_tecnomecanica ? new Date(conductor.vehiculo.fecha_tecnomecanica) : null;
            var diferencia = Math.floor((fecha_licencia - new Date()) / (1000 * 60 * 60 * 24))
            if (diferencia <= 30) {
                conductor.pv_licencia = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            diferencia = Math.floor((fecha_seguroac - new Date()) / (1000 * 60 * 60 * 24))
            if (diferencia <= 30) {
                conductor.pv_seguroac = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            diferencia = Math.floor((fecha_soat - new Date()) / (1000 * 60 * 60 * 24))
            if (diferencia <= 30) {
                conductor.pv_soat = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            diferencia = Math.floor((fecha_tecnomecanica - new Date()) / (1000 * 60 * 60 * 24))
            if (diferencia <= 30) {
                conductor.pv_tecnomecanica = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            return false;
        }

        function newModalConductor(ev, tipo) {
            vm.selected.identificacion = parseInt(vm.selected.identificacion);
            vm.selected.telefono = parseInt(vm.selected.telefono);
            $mdDialog.show({
                locals: {
                    tipo: tipo,
                    conductor: vm.selected
                },
                controller: NewConductorController,
                controllerAs: 'vm',
                templateUrl: 'app/main/empresas/gestion_conductores/new_conductor/new_conductor.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false
            })
                .then(function (response) {
                    console.log(response);
                    if (response.metadata.code == "OK" || response.metadata.code == "ok") {
                        if (response.metadata.tipo == 'Nuevo') {
                            vm.conductores.push(response);
                        }
                        Toast(response.metadata.mensaje, 'bottom right')
                    }
                }, function (reponse) {

                });
        }

        function deleteConductor(ev) {
            var confirm = $mdDialog.confirm()
                .title('Estas seguro que deseas eliminar este conductor?')
                .textContent('Tendras que volver a digitar sus datos para crearlo.')
                .ariaLabel('No lo creo')
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('Continuar!')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function() {
                vm.selected.remove().then(success, error)
                function success(response) {
                    vm.conductores.splice(vm.index, 1);
                    if (vm.conductores.length > 0) {
                        vm.selected = vm.conductores[0];
                    }else{
                        vm.selected = null;
                    }
                    Toast('Conductor eliminada correctamente');
                }
                function error(response) {
                    console.log(response);
                }
            }, function() {
                console.log('Menos mal')
            });
        }
    }
})();

