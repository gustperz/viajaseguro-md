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
        var campos = 'identificacion, nombres, apellidos, direccion, email, fecha_nacimiento, central,' +
            ' telefono, activo, imagen, fecha_licencia, nlicencia, tipo_licencia, vehiculo, vehiculo.fecha_seguroac, ' +
            'vehiculo.fecha_soat, vehiculo.fecha_tecnomecanica';
        vm.conductores = [];
        vm.conductoresInactivos = [];
        vm.selected = null;
        vm.n_cond_doc_venc = 0;
        vm.alternarConductores = true;

        // Methods
        vm.selectedConductor = selectedConductor;
        vm.abrirPanel = abrirPanel;
        vm.toggleSidenav = toggleSidenav;

        vm.newModalConductor = newModalConductor;
        vm.editModalConductor = editModalConductor;
        vm.updateEstado = updateEstado;
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
            vm.conductores = [];
            vm.conductoresInactivos = [];
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
            var doc_vencida = false
            conductor.pv_licencia = check(conductor.fecha_licencia) && vm.n_cond_doc_venc++;
            conductor.pv_seguroac = check(conductor.fecha_seguroac) && vm.n_cond_doc_venc++;
            conductor.pv_soat = check(conductor.vehiculo.fecha_soat) && vm.n_cond_doc_venc++;
            conductor.pv_tecnomecanica = check(conductor.vehiculo.fecha_tecnomecanica) && vm.n_cond_doc_venc++;

            return doc_vencida;

            function check(fecha) {
                if (moment(fecha, "YYYY-MM-DD").diff(moment(), 'days') <= 30) {
                    doc_vencida = true;
                    return doc_vencida;
                }
            }
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
                    if (response.metadata.code == "OK" || response.metadata.code == "ok") {
                        Toast(response.metadata.mensaje, 'bottom right')
                    }
                }, function (reponse) {

                });
        }

        function updateEstado() {
            delete vm.selected.vehiculo;
            vm.selected.put(vm.selected).then(success, error);
            function success(response) {
                getConductores();
                if(vm.alternarConductores == false|| vm.conductoresInactivos.length <= 0)
                    vm.alternarConductores = true;
            }
            function error(response) {

            }
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

