/**
 * Created by tav0 on 24/08/16.
 */

(function() {
    'use strict';

    angular
        .module('app.auth')
        .run(permissionRun);

    /* @ngInject */
    function permissionRun($rootScope, $state, PermRoleStore, authService) {

        console.log(authService.getCurrentUser());

        // create roles for app
        var roles = ['CENTRAL_EMPRESA', 'EMPRESA', 'SUPER_ADM'];
        angular.forEach(roles, function (rol) {
            PermRoleStore.defineRole(rol, function (roleName, stateParams) {
                return authService.hasPermission(roleName);
            });
        });

        // default redirect if access is denied
        function accessDenied() {
            $state.go('401');
        }

        // watches

        // redirect all denied permissions to 401
        var deniedHandle = $rootScope.$on('$stateChangePermissionDenied', accessDenied);

        // remove watch on destroy
        $rootScope.$on('$destroy', function() {
            deniedHandle();
        });

        $rootScope.$on('$stateChangeStart', function (event, to)
        {
            if (to.data && to.data.permissions) {
                if (!authService.checkSession()) {
                    event.preventDefault();
                    $state.go('app.login');
                }
            }
        });
    }
})();