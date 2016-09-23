function NewEmpresaController($mdDialog, Toast, Empresas, tipo, empresa) {
    // variables
    var vm = this;
    vm.empresa = {} || empresa;
    vm.tipoModal = tipo;
    vm.tipoEmpresas = [
        {
            id: 0,
            nombre : 'Especial'
        },
        {
            id: 1,
            nombre: 'Intermunicipal'
        }
    ];

    // funciones
    vm.guardarEmpresa = guardarEmpresa;
    vm.modificarEmpresa = modificarEmpresa;
    vm.cancel = cancel;

    //////////

    if (vm.tipoModal == 'Modificar') vm.empresa = empresa;

    //////////

    function guardarEmpresa() {
        Empresas.create(vm.empresa).then(success, error);

        function success(response) {
            response.metadata.mensaje = "Empresa creada correctamente";
            response.metadata.tipo = vm.tipoModal;
            $mdDialog.hide(response);
        }

        function error(response) {
            if (response.data.code == 'E_VALIDATION') {
                angular.forEach(response.data, function (campo) {
                    if (campo.nit) {
                        angular.forEach(campo.nit, function (rules) {
                            if (rules.rule == 'unique') {
                                Toast('Ya se encuentra una empresa registrada con el NIT:  <b> ' + rules.value + '</b>. verificalo nuevamente!');
                            }
                        });
                    }
                });
            }
        }
    }

    function modificarEmpresa() {
        vm.empresa.put().then(success, error);

        function success(response) {
            vm.empresa = {};
            response.metadata.mensaje = "Empresa actualizada correctamente";
            response.metadata.tipo = vm.tipoModal;
            $mdDialog.hide(response);
        }

        function error(response) {
            if (response.data.code == 'E_VALIDATION') {
                angular.forEach(response.data, function (campo) {
                    if (campo.nit) {
                        angular.forEach(campo.nit, function (rules) {
                            if (rules.rule == 'unique') {
                                Toast('Ya se encuentra una empresa registrada con el NIT:  <b> ' + rules.value + '</b>. verificalo nuevamente!');
                            }
                        });
                    }
                });
            }
        }
    }

    function cancel() {
        $mdDialog.cancel();
    }
}
