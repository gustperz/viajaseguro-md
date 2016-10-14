(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('AsignacionesController', controller);

    /** @ngInject */
    function controller(Despacho, SolicitudesRepository, OneRequest){
        var vm = this;

        vm.solicitud = {
            pasajeros: [{
                identificacion: '',
                nombre: ''
            }],
            telefono : undefined,
            direccion: undefined
        }
        vm.telefonos = [];
        vm.direcciones = [];

        vm.addPasajero = addPasajero;
        vm.removePasajero = removePasajero;
        vm.loadCliente = loadCliente;
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
                identificacion: '',
                nombre: ''
            });
        }

        function removePasajero(index) {
            vm.solicitud.pasajeros.splice(index, 1);
        }

        function loadCliente(index) {
            var identificacion = vm.solicitud.pasajeros[index].identificacion;
            OneRequest.to('clientes/'+identificacion).then(function (cliente) {
                if(cliente) {
                    vm.solicitud.pasajeros[index] = {
                        identificacion: cliente.identificacion,
                        nombre: cliente.nombre
                    };
                    cliente.telefono && vm.telefonos.push(cliente.telefono);
                    cliente.direccion && vm.direcciones.push(cliente.direccion);
                }
            });
        }

        function clear() {
            vm.solicitud = {
                pasajeros: [{
                    identificacion: '',
                    nombre: ''
                }],
                telefono : undefined,
                direccion: undefined
            }
        }

        function pasarSolicitudaPendiente(solicitud){
            Despacho.cupos_disponibles += solicitud.pasajeros.length;
            checkContrtante(solicitud.pasajeros[0].identificacion);
            solicitud.setAsPendiente();
        }

        function rejectSolicitud(solicitud){
            Despacho.cupos_disponibles += solicitud.pasajeros.length;
            checkContrtante(solicitud.pasajeros[0].identificacion);
            solicitud.reject();
        }

        function reasignarSolicitud(solicitud, conductor) {
            Despacho.cupos_disponibles += solicitud.pasajeros.length;
            checkContrtante(solicitud.pasajeros[0].identificacion);
            solicitud.assignTo(conductor);
        }
        
        function checkContrtante(identificacion) {
            if(Despacho.contratante && Despacho.contratante.identificacion == identificacion){
                Despacho.contratante = undefined;
                sessionStorage.removeItem('contratante_despacho');
            }
        }

    }
})();
