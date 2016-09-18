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
            detalle: 'Motocicletas con cilindrada hasta 125 c.c.'
        },
        {
            nombre: 'A2',
            detalle: 'Motocicletas , mototriciclos con cilindrada mayor a 125 c.c.'
        },
        {
            nombre: 'B1',
            detalle: 'Automóviles, motocarros, cuatrimotos, camperos, camionetas y microbuses de servicio particular.'
        },
        {
            nombre: 'B2',
            detalle: 'Camiones rígidos, busetas y buses de servicio particular.'
        },
        {
            nombre: 'B3',
            detalle: 'Vehículos articulados de servicio particular.'
        },
        {
            nombre: 'C1',
            detalle: 'Automóviles, motocarros, cuatrimotos, camperos, camionetas y microbuses de servicio de servicio público.'
        },
        {
            nombre: 'C2',
            detalle: 'Camiones rígidos, busetas y buses de servicio de servicio público.'
        },
        {
            nombre: 'C3',
            detalle: 'Vehículos articulados de servicio público.'
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