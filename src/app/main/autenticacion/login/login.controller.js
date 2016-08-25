(function () {
    'use strict';

    angular
        .module('app.autenticacion.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(Restangular, $state, authService, $mdToast) {
        var vm = this;
        var login = Restangular.all('/login');

        vm.usuario = {};
        vm.mensajeError = '';

        vm.iniciarSesion = iniciarSesion;

        if (authService.currentUser())
            redirectRoles(authService.currentUser().rol);

        function iniciarSesion() {
            vm.mensajeError = '';
            login.post(vm.usuario).then(success, error);

            function success(p) {
                var usuario = authService.storeUser(p.token);
                redirectRoles(authService.currentUser().rol);
            }

            function error(error) {
                vm.mensajeError = error.status == 401 ? error.data.mensajeError : 'Ha ocurrido un error inesperado';
                var mensaje = vm.mensajeError;
                $mdToast.show({
                    template: '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + mensaje + '</div></md-toast>',
                    hideDelay: 4000,
                    position: 'top right',
                    parent: '#content'
                });
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
