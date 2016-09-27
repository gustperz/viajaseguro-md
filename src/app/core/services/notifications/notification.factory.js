/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('NotifitationFactory', NotifitationFactory);

    /* @ngInject */
    function NotifitationFactory() {
        return {
            'requestPermission': requestPermission,
            'onSolicitudRecived': onSolicitudRecived,
            'onNotificationRecived': onNotificationRecived
        };

        function requestPermission() {
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        }

        function onSolicitudRecived(data) {
            var options = {
                body: data.message
            };
            var notificacion = new Notification('Nueva notificación de: ' + data.tipo, options);
            if (!isNotificationSupported()) {
                logg("Tu navegador no soporta Notificaciones. Por favor, utiliza una versión Reciente del Navegador Google Chrome o Safari.");
                return;
            }
            // Si el Navegador soporta las Notificaciones HTML 5, entonces que proceda a Notificar
            setTimeout(notificacion.close.bind(notificacion), 10000);
        }



         function onNotificationRecived(data) {
            var options = {
                body: data.message
            };
            if (!isNotificationSupported()) {
                logg("Tu navegador no soporta Notificaciones. Por favor, utiliza una versión Reciente del Navegador Google Chrome o Safari.");
                return;

            }
            // Si el Navegador soporta las Notificaciones HTML 5, entonces que proceda a Notificar
            var notificacion = new Notification('Nueva: ' + data.tipo, options);
            setTimeout(notificacion.close.bind(notificacion), 10000);
        }


        // Luego del Permiso del Sistema, le indicamos que nos Muestre la Notificación
        function isNotificationSupported() {
            return ("Notification" in window);
        }

        // Mostramos el Mensaje de la Notificación
        function logg(mensaje) {
            notificador.innerHTML += "<p>" + mensaje + "</p>";
        }
    }
})();
