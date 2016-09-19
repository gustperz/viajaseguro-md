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

            OneRequest.post('user/authentication', vm.usuario).then(success, error);

            function success(p) {
                var usuario = authService.storeUser(p.token, p.user);
                redirectRoles(usuario.rol);
            }

            function error(error) {
                if(error.status == 401) {
                    vm.error = true;
                }else{
                    Toast('Ha ocurrido un error inesperado, intentalo nuevamente.');
                }
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
