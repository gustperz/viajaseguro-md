function NewEmpresaController($mdDialog, Toast, Empresas, tipo, empresa) {
    // variables
    var vm = this;
    vm.empresa = {};
    vm.tipoModal = tipo;

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
            if (response.metadata.code == 'E_VALIDATION') {
                Toast('Algunos campos son requeridos', 'bottom right');
            } else {
                Toast(response.metadata.data);
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
