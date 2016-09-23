/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.gestion_vehiculos')
        .controller('EmpresaVehiculosController', EmpresaVehiculosController);

    /** @ngInject */
    function EmpresaVehiculosController(Vehiculos, $mdSidenav, $mdDialog, Toast) {
        var vm = this;
        var campos = 'placa, modelo, color, codigo_vial, fecha_soat, fecha_tecnomecanica, soat, tecnomecanica,' +
            ' tarjeta_propiedad, cupos, cedula_propietario, nombre_propietario, telefono_propietario, imagen';
        vm.vehiculos = [];
        vm.selected = {};
        vm.n_vehi_doc_venc = 0;

        // Data

        // Methods
        vm.selectedVehiculo = selectedVehiculo;
        vm.abrirPanel = abrirPanel;
        vm.toggleSidenav = toggleSidenav;
        vm.deleteVehiculo = deleteVehiculo;

        //////////
        getVehiculos();
        /////////
        function selectedVehiculo(vehiculo, $index) {
            vm.selected = vehiculo;
            vm.index = $index;
        }

        function abrirPanel(vehiculo, $index) {
            vm.selected = vehiculo;
            vm.index = $index;
            toggleSidenav('details-sidenav');
        }

        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

        function getVehiculos() {
            Vehiculos.getList({fields: campos})
                .then(function (data) {
                    data.forEach(function (vehiculo) {
                        vehiculo.doc_venc = documentacionPorVencer(vehiculo);
                        vm.vehiculos.push(vehiculo);
                    });
                    vm.selected = vm.vehiculos[0];
                    if(vm.n_vehi_doc_venc > 0) Toast('Uno o mas vehiculos tiene documentacion proxima a vencer, por favor, verificalos en la lista.')
                }, function (error) {
                    console.log(error);
                });
        }

        function documentacionPorVencer(vehiculo) {
            const fecha_soat = vehiculo.fecha_soat ? new Date(vehiculo.fecha_soat) : null;
            const fecha_tecnomecanica = vehiculo.fecha_tecnomecanica ? new Date(vehiculo.fecha_tecnomecanica) : null;
            var diferencia = Math.floor((fecha_soat - new Date()) / (1000 * 60 * 60 * 24))
            if (diferencia <= 30) {
                vehiculo.pv_soat = true;
                vm.n_vehi_doc_venc++;
                return true;
            }
            diferencia = Math.floor((fecha_tecnomecanica - new Date()) / (1000 * 60 * 60 * 24))
            if (diferencia <= 30) {
                vehiculo.pv_tecnomecanica = true;
                vm.n_vehi_doc_venc++;
                return true;
            }
            return false;
        }

        function deleteVehiculo(ev) {
            var confirm = $mdDialog.confirm()
                .title('Estas seguro que deseas eliminar este vehiculo?')
                .textContent('Tendras que volver a digitar sus datos para crearlo.')
                .ariaLabel('No lo creo')
                .targetEvent(ev)
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('Continuar!')
                .cancel('Cancelar');
            $mdDialog.show(confirm).then(function () {
                vm.selected.remove().then(success, error)
                function success(response) {
                    vm.vehiculos.splice(vm.index, 1);
                    if (vm.vehiculos.length > 0) {
                        vm.selected = vm.vehiculos[0];
                    } else {
                        vm.selected = null;
                    }
                    Toast('Vehiculo eliminado correctamente');
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

