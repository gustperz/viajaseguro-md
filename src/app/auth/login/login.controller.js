(function () {
    'use strict';

    angular
        .module('app.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(OneRequest, $state, authService, Toast,$http) {
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

            OneRequest.post('user/authentication', vm.usuario).then(success, error);

            function success(p) {
                var usuario = authService.storeUser(p.data.token, p.data.user);
                redirectRoles(usuario.rol);
            }

            function error(error) {
                var mensaje = error.status == 401 ? error.data.mensajeError : 'Ha ocurrido un error inesperado';
                Toast(mensaje);
            }
        }

        function redirectRoles(rol) {
            if (rol == 'CENTRAL_EMPRESA') {
                $state.go('app.central_despacho');
            } else if (rol == 'EMPRESA') {
                $state.go('app.empresa_conductores')
            } else if (rol == 'SUPER_ADM') {
                $state.go('app.gestion_empresas')
            }
        }
    }
})();
