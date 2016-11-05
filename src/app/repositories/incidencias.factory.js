/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.repositories')
        .factory('NotificacionesRepository', SocketcSailsService);

    /* @ngInject */
    function SocketcSailsService($sails, Notify) {
        var subscribed = false;

        return {
            'incidencia': incidencia,
            'estados': estados
        };

        function incidencia() {
            if(!subscribed){
                console.log('Suscrito a incidencias');
                $sails.on('newIncidencia', function (response) {
                    console.log(response)
                    Notify({
                        tittle: 'Nueva incidencia',
                        message : 'El conductor '+ response.conductor.nombres +
                        ' ' + response.conductor.apellidos + ' ha reportado un(a) '
                        + response.incidencia.concepto,
                        url_imagen: 'images/conductores/' + response.conductor.imagen
                    });
                    console.log('newIncidencia')
                });
                subscribed = true;
            }
        }

        function estados() {
            if(!subscribed){
                console.log('Suscrito a cambio de estados');

                $sails.on('cambioEstado', function (response) {
                    var audio = new Audio('http://api.viajaseguro.co/sounds/alarma_estado.mp3');
                    audio.play();
                    Notify({
                        tittle: 'Notificacion',
                        message : 'El vehiculo '+ response.codigo_vial +
                        ' del conductor ' + response.nombres + ' ' + response.apellidos +
                        ' se ha colocado como ' + response.estado,
                        url_imagen: 'images/conductores/' + response.imagen
                    });
                });
                subscribed = true;
            }
        }
    }
})();

