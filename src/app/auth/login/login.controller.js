(function () {
    'use strict';

    angular
        .module('app.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(OneRequest, $state, authService, Toast) {
        var vm = this;
        vm.usuario = {};

        vm.iniciarSesion = iniciarSesion;

        //////////

        if (authService.getCurrentUser()) {
            redirectRoles(authService.getCurrentUser().rol);
        }

        //////////

        function iniciarSesion() {
            vm.mensajeError = '';
            OneRequest.post('login', vm.usuario).then(success, error);

            function success(p) {
                var usuario = authService.storeUser(p.token);
                redirectRoles(usuario.rol);
            }

            function error(error) {
                var mensaje = error.status == 401 ? error.data.mensajeError : 'Ha ocurrido un error inesperado';
                Toast(mensaje);
            }
        }

        function redirectRoles(rol) {
            if(rol == 'CENTRAL_EMPRESA'){
                $state.go('app.central_despacho');
            }else if(rol == 'EMPRESA'){

            }else if(rol == 'SUPER_ADM'){

            }
        }
    }
})();
