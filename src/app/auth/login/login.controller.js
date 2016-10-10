(function () {
    'use strict';

    angular
        .module('app.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(OneRequest, $state, authService, Toast, $mdDialog) {
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
                if(usuario.rol == 'CENTRAL_EMPRESA'){
                   if(usuario.empresa.activa != true){
                       noActiva('EL ADMINISTRADOR DEL SISTEMA HA CANCELADO SU SUSCRIPCION, POR FAVOR \n  ' +
                           ' COMUNICATE LO MAS PRONTO PARA SU REACTIVACION')
                       sessionStorage.clear();
                   }else{
                       redirectRoles(usuario.rol);
                   }
                }else{
                    redirectRoles(usuario.rol);
                }

            }

            function error(error) {
                if(error.status == 401){
                    if(error.data.code == 'E_UNAUTHORIZED'){
                        noActiva('EL ADMINISTRADOR DEL SISTEMA HA CANCELADO SU SUSCRIPCION, POR FAVOR \n  ' +
                            ' COMUNICATE LO MAS PRONTO PARA SU REACTIVACION')
                    }
                    if (error.data.code == 'E_USER_NOT_FOUND') {
                        vm.error = true;
                    }
                }else{
                    Toast('Ha ocurrido un error inesperado, intentalo nuevamente.');
                }

            }
        }

        function noActiva(mensaje) {
            alert = $mdDialog.alert()
                .title('ATENCION !')
                .textContent(mensaje)
                .ok('Cerrar');

            $mdDialog
                .show( alert )
                .finally(function() {
                    alert = undefined;
                });
        }

        function redirectRoles(rol) {
            if (rol == 'CENTRAL_EMPRESA') {
                $state.go('app.central_despacho');
            } else if (rol == 'EMPRESA') {
                $state.go('app.empresa_centrales')
            } else if (rol == 'SUPER_ADM') {
                $state.go('app.gestion_empresas')
            }
        }
    }
})();
