/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .service('Solitudes', SocketcSailsService);

    /* @ngInject */
    function SocketcSailsService($sails, Notify) {
        var solicitudes = undefined;
        return {
            'getList': getList,
            'create': create
        };

        function getList(cb) {
            if(!solicitudes){
                $sails.request({
                    method: 'get',
                    url: '/solicitudes',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                    }
                }, function (response) {
                    if (response.code == 'OK'){
                        solicitudes = response.data.map(function (solicitud, index) {
                            solicitud.index = index;
                            return make(solicitud);
                        });
                        cb(solicitudes)
                    }
                });

                $sails.on('newSolicitud', function (solicitud) {
                    Notify({
                        tittle: 'Nueva solicitud',
                        message : 'Has recivido una nueva solicitud, verificala en la lista'
                    });
                    solicitud.index = solicitudes.length;
                    solicitudes.push(make(solicitud));
                });
            }
        }

        function create(solicitud) {
            $sails.request({
                method: 'post',
                url: '/solicitudes' ,
                data: solicitud,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, function (response) {
                console.log(response)
                solicitudes.push(make(response.data));
            });
        }
        
        function make(data) {
            function Solicitud(data) {
                angular.extend(this, data);
                this.index = undefined;
            }

            Solicitud.prototype = {
                reject: rejectSolicitud,
                update: updateEstado,
            }

            function rejectSolicitud(motivo) {
                var index = this.index;
                $sails.request({
                    method: 'post',
                    url: '/solicitudes/'+this.id+'/reject',
                    data: motivo,
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                    }
                }, function (response) {
                    if (response.code == 'OK'){
                        solicitudes.splice(index, 1);
                    }else{
                        console.log('fallo')
                    }
                });
            }

            function updateEstado(estado) {
                $sails.request({
                    method: 'post',
                    url: '/solicitudes/'+this.id+'/estado',
                    data: {estado: estado},
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                    }
                }, function (response) {
                    if (response.code == 'OK'){
                        console.log('ok')
                    }else{
                        console.log('fallo')
                    }
                });
            }

            return new Solicitud(data);
        }
    }
})();

