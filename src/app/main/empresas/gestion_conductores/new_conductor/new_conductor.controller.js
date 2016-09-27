/**
 * Created by Jose Soto Acosta on 14/09/2016.
 */
function NewConductorController($mdDialog, Toast, Conductores, tipo, conductor, Centrales) {
// variables
    var vm = this;
    vm.conductor = {};
    vm.tipoModal = tipo;
    vm.centrales = [];
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
            if (response.data.code == 'E_VALIDATION') {
                angular.forEach(response.data, function (campo) {
                    if (campo.identificacion) {
                        angular.forEach(campo.identificacion, function (rules) {
                            if (rules.rule == 'unique') {
                                Toast('Ya se encuentra registrado este numero de identificación. verificalo nuevamente!');
                            }
                        });
                    }
                    if (campo.email) {
                        angular.forEach(campo.email, function (rules) {
                            if (rules.rule == 'unique') {
                                Toast('Ya se encuentra registrado email, por favor, usa uno diferente!');
                            }
                        });
                    }
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

    function modificarConductor() {
        vm.conductor.put().then(success, error);

        function success(response) {
            // vm.conductor = {};
            response.metadata.mensaje = "Conductor actualizado correctamente";
            response.metadata.tipo = vm.tipoModal;
            $mdDialog.hide(response);
        }

        function error(response) {
            if (response.data.code == 'E_VALIDATION') {
                angular.forEach(response.data, function (campo) {
                    if (campo.identificacion) {
                        angular.forEach(campo.identificacion, function (rules) {
                            if (rules.rule == 'unique') {
                                Toast('Ya se encuentra registrado este numero de identificación. verificalo nuevamente!');
                            }
                        });
                    }
                    if (campo.email) {
                        angular.forEach(campo.email, function (rules) {
                            if (rules.rule == 'unique') {
                                Toast('Ya se encuentra registrado email, por favor, usa uno diferente!');
                            }
                        });
                    }
                });
            }
        }
    }

    loadCentrales();
    function loadCentrales() {
        Centrales.getList({fields: 'id, ciudad, direccion', populate: 'ciudad'}).then(function (centrales) {
            vm.centrales = centrales;
        })
    }
    function cancel() {
        $mdDialog.cancel();
    }
}