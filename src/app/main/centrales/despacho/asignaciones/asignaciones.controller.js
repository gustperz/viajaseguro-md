(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('AsignacionesController', controller);

    /** @ngInject */
    function controller(Despacho, SolicitudesRepository){
        var vm = this;

        vm.solicitud = {
            pasajeros: [{
                identififcacion: '',
                nombre: ''
            }],
            telefono : undefined,
            direccion: undefined
        }

        vm.addPasajero = addPasajero;
        vm.removePasajero = removePasajero;
        vm.clear = clear;
        vm.saveSolicitud = saveSolicitud;
        vm.pasarSolicitudaPendiente = pasarSolicitudaPendiente;
        vm.rejectSolicitud = rejectSolicitud;
        vm.reasignarSolicitud = reasignarSolicitud;

        //////////

        SolicitudesRepository.load()

        //////////
        
        function saveSolicitud() {
            var solicitud = vm.solicitud;
            solicitud.conductor = Despacho.conductor.id;
            solicitud.codigo_ruta = Despacho.destino.codigo;
            solicitud.tipo = 'Pasajeros';
            solicitud.estado = 'a';

            if(solicitud.direccion){
                solicitud.cliente = solicitud.pasajeros[0].identificacion;
                SolicitudesRepository.create(vm.solicitud);
            } else {
                angular.forEach(solicitud.pasajeros, function (pasajero) {
                    solicitud.pasajeros = [pasajero];
                    solicitud.cliente = pasajero;
                    SolicitudesRepository.create(vm.solicitud);
                });
            }
            Despacho.cupos_disponibles = Despacho.cupos_disponibles - solicitud.pasajeros.length;
            clear();
        }

        function addPasajero() {
            vm.solicitud.pasajeros.push({
                identififcacion: '',
                nombre: ''
            });
        }

        function removePasajero(index) {
            vm.solicitud.pasajeros.splice(index, 1);
        }

        function clear() {
            vm.solicitud = {
                pasajeros: [{
                    identififcacion: '',
                    nombre: ''
                }],
                telefono : undefined,
                direccion: undefined
            }
        }

        function pasarSolicitudaPendiente(solicitud){
            Despacho.cupos_disponibles = Despacho.cupos_disponibles + solicitud.pasajeros.length;
            solicitud.setAsPendiente();
        }

        function rejectSolicitud(solicitud){
            Despacho.cupos_disponibles = Despacho.cupos_disponibles + solicitud.pasajeros.length;
            solicitud.reject();
        }

        function reasignarSolicitud(solicitud, conductor) {
            Despacho.cupos_disponibles = Despacho.cupos_disponibles + solicitud.pasajeros.length;
            solicitud.assignTo(conductor);
        }

    }
})();
