/**
 * Created by Jose Soto Acosta on 14/09/2016.
 */
function NewConductorController($mdDialog, Toast, Vehiculos, tipo, vehiculo) {
// variables
    var vm = this;
    vm.vehiculo = {};
    vm.tipoModal = tipo;

    // funciones
    vm.guardarVehiculo = guardarVehiculo;
    vm.modificarVehiculo = modificarVehiculo;
    vm.cancel = cancel;

    //////////

    if (vm.tipoModal == 'Modificar') vm.vehiculo = vehiculo;

    //////////

    function guardarVehiculo() {
        Vehiculos.create(vm.vehiculo).then(success, error);

        function success(response) {
            response.metadata.mensaje = "Vehiculo creado correctamente";
            response.metadata.tipo = vm.tipoModal;
            $mdDialog.hide(response);
        }

        function error(response) {
            if (response.data.code == 'E_VALIDATION') {
                angular.forEach(response.data, function (campo) {
                    if (campo.placa) {
                        angular.forEach(campo.placa, function (rules) {
                            if (rules.rule == 'unique') {
                                Toast('Este numero de placa de vehiculo ya se encuentra registrado, usa uno distinto!');
                            }
                        });
                    }
                });
            }
        }
    }

    function modificarVehiculo() {
        vm.vehiculo.put().then(success, error);

        function success(response) {
            // vm.conductor = {};
            response.metadata.mensaje = "Vehiculo actualizado correctamente";
            response.metadata.tipo = vm.tipoModal;
            $mdDialog.hide(response);
        }

        function error(response) {
            console.log('Algun error')
        }
    }

    function cancel() {
        $mdDialog.cancel();
    }
}