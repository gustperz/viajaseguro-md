(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [
            'angularMoment', 'restangular', 'ngMap', 'ng-sortable',

            // Core
            'app.core',
            // Constants
            'app.constansts',
            // Errors
            'app.errors',
            // Repos
            'app.repositories',
            // Navigation
            'app.navigation',
            // Toolbar
            'app.toolbar',
            // Quick panel
            'app.quick-panel',
            // utenticacion
            'app.auth',
            // super admin
            'app.super_adm',
            // centrales
            'app.centrales',
            // empresas
            'app.empresas'
        ]);
})();
