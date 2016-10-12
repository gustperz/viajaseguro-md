function NewEmpresaController($mdDialog, Toast, Empresas, tipo, empresa, Modulos, $scope) {
    // variables
    var vm = this;
    vm.empresa = {} || empresa;
    vm.tipoModal = tipo;
    vm.modulos = [];
    vm.listaModulosContratados = [];
    vm.tipoEmpresas = [
        {
            id: 0,
            nombre: 'Especial'
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
    getModulos();
    function getModulos() {
        var campos = 'nombre';
        Modulos.getList({fields: campos}).then(success, error);

        function success(response) {
            vm.modulos = response;
        }

        function error(response) {
            console.log(response);
        }
    }

    function guardarEmpresa() {
        // if(vm.listaModulosContratados.length <= 0){
        //     Toast('No ha seleccionado ningun modulo de contrato')
        // }else{
        // vm.empresa.modulos_contratados_empresa = vm.listaModulosContratados;
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

        // }
    }

    function modificarEmpresa() {
        if (vm.listaModulosContratados <= 0) {
            Toast('No ha seleccionado ningun modulo de contrato')
        } else {
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
    }

    function cancel() {
        $mdDialog.cancel();
    }

    vm.selected = [];
    vm.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
            vm.listaModulosContratados = list;
        }
        else {
            list.push(item);
            vm.listaModulosContratados = list;
        }
    };
    vm.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
}
