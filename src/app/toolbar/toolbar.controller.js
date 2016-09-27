(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($mdSidenav, msNavigationService, $state)
    {
        var vm = this;

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
            sessionStorage.clear();
            $state.go('app.login');
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