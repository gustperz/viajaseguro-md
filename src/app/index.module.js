(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [
            'angularMoment', 'angular-jwt', 'restangular',

            // Core
            'app.core',
            // Errors
            'app.errors',
            // Navigation
            'app.navigation',
            // Toolbar
            'app.toolbar',
            // Quick panel
            'app.quick-panel',
            // utenticacion
            'app.auth',
            // centrales
            'app.centrales'
        ]);
})();