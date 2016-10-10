/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.gestion_conductores')
        .controller('EmpresaConductoresController', EmpresaConductoresController);

    /** @ngInject */
    function EmpresaConductoresController(Conductores, $mdSidenav, $mdDialog, Toast) {
        var vm = this;
        var campos = 'identificacion, nombres, apellidos, direccion, email, fecha_nacimiento,' +
            ' telefono, activo, imagen, fecha_licencia, nlicencia, tipo_licencia, vehiculo.fecha_seguroac, vehiculo,' +
            ' vehiculo.codigo_vial, vehiculo.placa, vehiculo.modelo, vehiculo.fecha_soat, vehiculo.fecha_tecnomecanica,' +
            ' vehiculo.cupos, vehiculo.cedula_propietario, vehiculo.telefono_propietario, vehiculo.color,' +
            ' vehiculo.nombre_propietario, vehiculo.soat, vehiculo.tecnomecanica';
        vm.conductores = [];
        vm.conductoresInactivos = [];
        vm.selected = {};
        vm.n_cond_doc_venc = 0;
        vm.alternarConductores = true;

        // Methods
        vm.selectedConductor = selectedConductor;
        vm.abrirPanel = abrirPanel;
        vm.toggleSidenav = toggleSidenav;

        vm.newModalConductor = newModalConductor;
        vm.editModalConductor = editModalConductor;
        vm.deleteConductor = deleteConductor;
        //////////
        getConductores();
        /////////
        function selectedConductor(conductor, $index) {
            vm.selected = conductor;
            vm.index = $index;
        }

        function abrirPanel(conductor, $index) {
            vm.selected = conductor;
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
                            conductor.doc_venc = documentacionPorVencer(conductor);
                            vm.conductoresInactivos.push(conductor);
                        }
                    });
                    if(vm.conductores.length > 0){
                        vm.selected = vm.conductores[0];
                    }else{
                        vm.selected = null;
                    }
                    if (vm.n_cond_doc_venc > 0) Toast('Existen uno o mas conductores con documentacion a vencer, verificalos en la lista')
                }, function (error) {
                    console.log(error);
                });
        }

        //////////

        vm.alternarConductoresI = function () {
            if (vm.alternarConductores == true) {
                vm.alternarConductores = false;
            } else {
                vm.alternarConductores = true;
            }
        };

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
                    if (response.metadata.code == "OK" || response.metadata.code == "ok") {
                        vm.conductores.push(response);
                        Toast(response.metadata.mensaje, 'bottom right')
                    }
                }, function (reponse) {

                });
        }

        function editModalConductor(ev, tipo) {
            delete vm.selected.vehiculo;
            vm.selected.identificacion = parseInt(vm.selected.identificacion);
            vm.selected.telefono = parseInt(vm.selected.telefono);
            vm.selected.nlicencia = parseInt(vm.selected.nlicencia);
            vm.selected.fecha_licencia = new Date(vm.selected.fecha_licencia);
            vm.selected.fecha_seguroac = new Date(vm.selected.fecha_seguroac);
            vm.selected.fecha_nacimiento = new Date(vm.selected.fecha_nacimiento);

            $mdDialog.show({
                locals: {
                    tipo: tipo,
                    conductor: vm.selected
                },
                controller: NewConductorController,
                controllerAs: 'vm',
                templateUrl: 'app/main/empresas/gestion_conductores/new_conductor/edit_conductor.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false
            })
                .then(function (response) {
                    console.log(response);
                    if (response.metadata.code == "OK" || response.metadata.code == "ok") {
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
            $mdDialog.show(confirm).then(function () {
                vm.selected.remove().then(success, error)
                vm.conductores.splice(vm.index, 1);
                function success(response) {
                    vm.conductores.splice(vm.index, 1);
                    if (vm.conductores.length > 0) {
                        vm.selected = vm.conductores[0];
                    } else {
                        vm.selected = null;
                    }
                    Toast('Conductor eliminado correctamente');
                }

                function error(response) {
                    console.log(response);
                }
            }, function () {
                console.log('Menos mal')
            });
        }
    }
})();

