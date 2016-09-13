function NewEmpresaController($mdDialog, Toast, OneRequest, tipo, empresa) {
    // variables
    var vm = this;
    vm.empresa = {};
    vm.tipoModal = tipo;

    // funciones
    vm.guardarEmpresa = guardarEmpresa;
    vm.modificarEmpresa = modificarEmpresa;
    vm.cancel = cancel;

    if (vm.tipoModal == 'Modificar')
        vm.empresa = empresa;

    function guardarEmpresa() {
        OneRequest.post('empresas/', vm.empresa).then(success, error);

        function success(response) {
            vm.empresa = {};
            response.mensaje = "Empresa creada correctamente";
            response.tipo = vm.tipoModal;
            $mdDialog.hide(response);
        }

        function error(response) {
            if (response.data.code == 'E_VALIDATION') {
                Toast('Algunos campos son requeridos', 'bottom right');
            } else {
                Toast(response.data.data);
            }
        }
    }

    function modificarEmpresa() {
        OneRequest.put('empresas/' + empresa.id, vm.empresa).then(success, error);

        function success(response) {
            vm.empresa = {};
            response.mensaje = "Empresa actualizada correctamente";
            response.tipo = vm.tipoModal;
            $mdDialog.hide(response);
        }

        function error(response) {
            if (response.data.code == 'E_VALIDATION') {
                Toast('Algunos campos son requeridos', 'bottom right');
            } else {
                Toast(response.data.data, 'bottom right');
            }
        }
    }

    function cancel() {
        $mdDialog.cancel();
    }
}