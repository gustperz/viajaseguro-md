/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .service('Solicitudes', SocketcSailsService);

    /* @ngInject */
    function SocketcSailsService($sails, Notify) {
        var solicitudes = undefined;
        var solicitudes_asiganadas = {};
        return {
            'getList': getList,
            'getAsignadas': getAsignadas,
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
                        solicitudes = [];
                        response.data.forEach(function (solicitud) {
                            if(solicitud.conductor){
                                solicitudes_asiganadas[solicitud.conductor] || (solicitudes_asiganadas[solicitud.conductor] = []);
                                solicitudes_asiganadas[solicitud.conductor].push(make(solicitud));
                            } else {
                                solicitud.index = solicitudes.length;
                                solicitudes.push(make(solicitud));
                            }
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
        
        function getAsignadas() {
            return solicitudes_asiganadas;
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
            }

            Solicitud.prototype = {
                reject: rejectSolicitud,
                update: updateEstado,
                assignTo: assignTo,
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
                    method: 'put',
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

            function assignTo(conductor) {
                var index = this.index;
                $sails.request({
                    method: 'put',
                    url: '/solicitudes/'+this.id+'/estado',
                    data: {estado: 'a', conductor: conductor},
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                    }
                }, function (response) {
                    if (response.code == 'OK'){
                        solicitudes[index].conductor = conductor;
                        solicitudes_asiganadas[conductor].push(solicitudes[index]);
                        solicitudes.splice(index, 1);
                    }else{
                        console.log('fallo')
                    }
                });
            }

            return new Solicitud(data);
        }
    }
})();

