/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .factory('SolicitudesRepository', SocketcSailsService);

    /* @ngInject */
    function SocketcSailsService($sails, SailsRequest, Notify, Solicitud, Despacho) {
        var subscribed = false;

        return {
            'load': load,
            'reload': reload,
            'create': create
        };

        function load() {
            if(!subscribed){

                $sails.on('newSolicitud', function (solicitud) {
                    Notify({
                        tittle: 'Nueva solicitud',
                        message : 'Has recivido una nueva solicitud, verificala en la lista'
                    });
                    reload();
                });

                $sails.on('cancel', function () {
                    reload();
                });

                $sails.on('reject', function () {
                    reload();
                });

                $sails.on('updateEstado', function () {
                    reload();
                });

                subscribed = true;
                reload();
            }
        }

        function reload() {
            SailsRequest({ method: 'get', url: '/solicitudes' }, function (response) {
                if (response.code == 'OK'){
                    Despacho.sp = []; Despacho.sa = {};
                    response.data.forEach(function (solicitud) {
                        if(solicitud.conductor && solicitud.estado == 'a'){
                            var conductor = solicitud.conductor;
                            Despacho.sa[conductor] || (Despacho.sa[conductor] = []);
                            Despacho.sa[conductor].push(new Solicitud(solicitud));
                        } else {
                            Despacho.sp.push(new Solicitud(solicitud));
                        }
                    });
                }
            });
        }

        function create(solicitud) {
            sails({ method: 'post', url: '/solicitudes' , data: solicitud, }, function () {
                reload();
            });
        }
    }
})();

