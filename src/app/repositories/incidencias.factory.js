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
        var subscribed_incidencia = false;
        var subscribed_estados = false;

        return {
            'load': load
        };

        function load() {
            incidencia()
            estados()
        }

        function incidencia() {
            if(!subscribed_incidencia){
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
                subscribed_incidencia = true;
            }
        }

        function estados() {
            if(!subscribed_estados){
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
                subscribed_estados   = true;
            }
        }
    }
})();

