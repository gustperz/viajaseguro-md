/**
 * Created by jose on 28/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('ListaSolicitudesController', controller);

    function controller(SocketcSailsService, authService, $sails) {
        SocketcSailsService.suscribe(authService.getCurrentUser().central.id);
        var vmsolicitudes = this;
        vmsolicitudes.solicitudes = JSON.parse(sessionStorage.getItem('solicitudes')) || [];

        $sails.on('newSolicitud', function (response) {
            vmsolicitudes.solicitudes.push(SocketcSailsService.newSolicitud(response));
        });

    }
})();
