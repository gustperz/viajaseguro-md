(function ()
{
    'use strict';

    angular
        .module('app.navigation')
        .controller('NavigationController', NavigationController);

    /** @ngInject */
    function NavigationController($scope, authService)
    {
        var vm = this;
        
        var usuario = authService.getCurrentUser();
        if(usuario.rol == 'SUPER_ADM'){
            vm.userNombre = 'Administrador';
            vm.userRol = usuario.rol;
            vm.userImagen = '../assets/images/profile.jpg';
        }else{
            vm.userNombre = usuario.username;
            vm.userRol = usuario.rol;
            vm.userImagen = '../assets/images/profile.jpg';
        }
    
        // Data
        vm.bodyEl = angular.element('body');
        vm.msScrollOptions = {
            suppressScrollX: true
        };

        //////////

        // Close the mobile menu on $stateChangeSuccess
        $scope.$on('$stateChangeSuccess', function ()
        {
            vm.bodyEl.removeClass('ms-navigation-horizontal-mobile-menu-active');
        });
    }

})();