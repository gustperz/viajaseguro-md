(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($mdSidenav, msNavigationService, $state, authService, $window)
    {
        var vm = this;
        vm.usuario = authService.getCurrentUser();

        vm.bodyEl = angular.element('body');
        vm.fecha = new Date();

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.irPerfil = irPerfil;
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

        //////////

        init();

        //////////

        /**
         * Initialize
         */
        function init()
        {

        }

        function irPerfil() {
            $state.go('app.empresa_perfil')
        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Logout Function
         */
        function logout()
        {
            authService.storeUser();
            sessionStorage.clear();
            $state.go('app.login');
            $window.location.reload();
        }

        /**
         * Toggle msNavigation folded
         */
        function toggleMsNavigationFolded()
        {
            msNavigationService.toggleFolded();
        }
    }

})();