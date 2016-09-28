/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .service('SocketcSailsService', SocketcSailsService);

    /* @ngInject */
    function SocketcSailsService(NotifitationFactory) {
        return {
            'suscribe': suscribe,
            'newNotification': newNotification,
            'newSolicitud': newSolicitud
        };

        function newNotification() {
            io.socket.on('newNotification', function (response) {
                NotifitationFactory.onNotificationRecived(response);
            });
        }

        function newSolicitud() {
            io.socket.on('newSolicitud', function (response) {
                NotifitationFactory.onSolicitudRecived(response);
            });
        }

        function suscribe(usuario) {
            io.socket.request({
                method: 'get',
                url: '/socket/join/central/'+usuario ,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                console.log(response)
            });
        }
    }
})();

