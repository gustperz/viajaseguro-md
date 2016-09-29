/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .service('SocketcSailsService', SocketcSailsService);

    /* @ngInject */
    function SocketcSailsService(NotifitationFactory, $sails) {
        return {
            'suscribe': suscribe,
            'newNotification': newNotification,
            'newSolicitud': newSolicitud
        };

        function newNotification() {
            $sails.on('newNotification', function (response) {
                NotifitationFactory.onNotificationRecived(response);
            });
        }

        function newSolicitud(response) {
            var noti = {
                message : 'Has recivido una nueva solicitud, verificala en la lista',
                tipo : response.tipo
            };
            NotifitationFactory.onSolicitudRecived(noti);
            return setItemSolicitud(response);
        }

        function suscribe(usuario) {
            $sails.request({
                method: 'get',
                url: '/socket/join/central/'+usuario ,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                console.log('Conectada')
            });
        }

        function setItemSolicitud(item) {
            var i = 0;
            var solicitudes = JSON.parse(sessionStorage.getItem('solicitudes')) || [];
            if(JSON.parse(sessionStorage.getItem('solicitudes'))){
                solicitudes = JSON.parse(sessionStorage['solicitudes']);
                solicitudes.push(item);
                sessionStorage.setItem('solicitudes', JSON.stringify(solicitudes));
                return item
            }else {
                solicitudes[0] = item;
                sessionStorage['solicitudes'] = JSON.stringify(solicitudes);
                return item
            }
        }
    }
})();

