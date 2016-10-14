/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .factory('SolicitudesRepository', SocketcSailsService);

    /* @ngInject */
    function SocketcSailsService($sails, Notify, Solicitud, Despacho) {
        var subscribed = false;

        return {
            'load': load,
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
            sails({ method: 'get', url: '/solicitudes' }, function (response) {
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
                    if(!Despacho.contratante){
                        Despacho.contratante = Despacho.sa[0].pasajeros[0];
                    }
                }
            });
        }

        function create(solicitud) {
            sails({ method: 'post', url: '/solicitudes' , data: solicitud, }, function () {
                reload();
            });
        }

        function sails(request, cb) {
            $sails.request({
                method: request.method,
                url: request.url,
                data: request.data,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, cb);
        }
    }
})();

