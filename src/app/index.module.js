(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [
            'angularMoment',
            // Core
            'app.core',
            //jwt
            'angular-jwt',
            //restangular
            'restangular',
            // Navigation
            'app.navigation',
            // Toolbar
            'app.toolbar',
            // utenticacion
            'app.autenticacion',
            // centrales
            'app.centrales'
        ]);
})();