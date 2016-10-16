/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.repositories')
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
                    console.log('newSolicitud')
                    reload();
                });

                $sails.on('cancel', function () {
                    console.log('cancel')
                    reload();
                });

                $sails.on('reject', function () {
                    console.log('reject')
                    reload();
                });

                $sails.on('updateEstado', function () {
                    console.log('updateEstado')
                    reload();
                });

                $sails.on('makingDespacho', function () {
                    console.log('makingDespacho')
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
                    Despacho.cupos_disponibles = 4;
                    response.data.forEach(function (solicitud) {
                        if(solicitud.conductor && solicitud.estado == 'a'){
                            var conductor = solicitud.conductor;
                            Despacho.sa[conductor] || (Despacho.sa[conductor] = []);
                            Despacho.sa[conductor].push(new Solicitud(solicitud));
                            if(Despacho.conductor && Despacho.conductor.id === conductor) {
                                Despacho.cupos_disponibles = Despacho.cupos_disponibles - solicitud.pasajeros.length;
                            }
                        } else {
                            Despacho.sp.push(new Solicitud(solicitud));
                        }
                    });
                }
            });
        }

        function create(solicitud) {
            SailsRequest({ method: 'post', url: '/solicitudes' , data: solicitud, }, function () {
                reload();
            });
        }
    }
})();

