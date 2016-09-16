/**
 * Created by Jose Soto Acosta on 14/09/2016.
 */
function NewConductorController($mdDialog, Toast, Conductores, tipo, conductor) {
// variables
    var vm = this;
    vm.conductor = {} || conductor;
    vm.tipoModal = tipo;
    vm.tiposLicencia = [
        {
            nombre: 'A1',
            detalle: 'Probando'
        },
        {
            nombre: 'A2',
            detalle: 'Probando'
        }
    ];

    // funciones
    vm.guardarConductor = guardarConductor;
    vm.modificarConductor = modificarConductor;
    vm.cancel = cancel;

    //////////

    if (vm.tipoModal == 'Modificar') vm.conductor = conductor;

    //////////

    function guardarConductor() {
        Conductores.create(vm.conductor).then(success, error);

        function success(response) {
            response.metadata.mensaje = "Conductor creado correctamente";
            response.metadata.tipo = vm.tipoModal;
            $mdDialog.hide(response);
        }

        function error(response) {
            if (response.metadata.code == 'E_VALIDATION') {
                Toast('Algunos campos son requeridos', 'bottom right');
            } else {
                Toast(response.metadata.data);
            }
        }
    }

    function modificarConductor() {
        vm.conductor.put().then(success, error);

        function success(response) {
            vm.conductor = {};
            response.metadata.mensaje = "Conductor actualizado correctamente";
            response.metadata.tipo = vm.tipoModal;
            $mdDialog.hide(response);
        }

        function error(response) {
            if (response.metadata.code == 'E_VALIDATION') {
                Toast('Algunos campos son requeridos', 'bottom right');
            } else {
                Toast(response.metadata.data, 'bottom right');
            }
        }
    }

    function cancel() {
        $mdDialog.cancel();
    }
}