(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($mdSidenav, msNavigationService)
    {
        var vm = this;

        vm.bodyEl = angular.element('body');
        vm.fecha = new Date();

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.noSelectFecha = noSelectFecha;
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

        function noSelectFecha(date) {
            return false;
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
            // Do logout here..
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