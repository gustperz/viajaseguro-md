/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .factory('Solicitudes', SocketcSailsService);

    /* @ngInject */
    function SocketcSailsService($sails, Notify, SolicitudesData) {
        return {
            'load': load,
            'create': create
        };

        function load() {
            if(!SolicitudesData.solicitudes){
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

                reload();
            }
        }

        function reload() {
            sails({ method: 'get', url: '/solicitudes' }, function (response) {
                if (response.code == 'OK'){
                    SolicitudesData.solicitudes = [];
                    SolicitudesData.solicitudes_asiganadas = {};
                    response.data.forEach(function (solicitud) {
                        console.log(solicitud)
                        if(solicitud.conductor && solicitud.estado == 'a'){
                            SolicitudesData.solicitudes_asiganadas[solicitud.conductor] || (SolicitudesData.solicitudes_asiganadas[solicitud.conductor] = []);
                            SolicitudesData.solicitudes_asiganadas[solicitud.conductor].push(make(solicitud));
                        } else {
                            solicitud.index = SolicitudesData.solicitudes.length;
                            SolicitudesData.solicitudes.push(make(solicitud));
                        }
                    });
                    console.log(SolicitudesData.solicitudes)
                }
            });
            console.log(SolicitudesData.solicitudes)
        }

        function create(solicitud) {
            sails({ method: 'post', url: '/solicitudes' , data: solicitud, }, function () {
                reload();
            });
        }
        
        function make(data) {
            function Solicitud(data) {
                angular.extend(this, data);
            }

            Solicitud.prototype = {
                reject: rejectSolicitud,
                setAsPendiente: setPendiente,
                assignTo: assignTo,
            }

            function rejectSolicitud(motivo) {
                sails({ method: 'post', url: '/solicitudes/'+this.id+'/reject', data: motivo });
            }

            function setPendiente() {
                sails({ method: 'put', url: '/solicitudes/'+this.id+'/estado', data: {estado: 'p'} });
            }

            function assignTo(conductor) {
                sails({ method: 'put', url: '/solicitudes/'+this.id+'/estado', data: {estado: 'a', conductor: conductor} });
            }

            return new Solicitud(data);
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

