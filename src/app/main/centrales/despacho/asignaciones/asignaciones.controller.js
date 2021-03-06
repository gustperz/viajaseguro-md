(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('AsignacionesController', controller);

    /** @ngInject */
    function controller(Despacho, SolicitudesRepository, OneRequest, Toast){
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
            if(!Despacho.conductor) return Toast('Debes seleccionar un conductor');

            var all_data = vm.solicitud.pasajeros.every(function(pasajero) {
                return pasajero.nombre != ''
            });

            if(all_data) {
                var solicitud = vm.solicitud;
                solicitud.conductor = Despacho.conductor.id;
                solicitud.codigo_ruta = Despacho.destino.codigo;
                solicitud.tipo = 'Pasajeros';
                solicitud.estado = 'a';
                solicitud.cliente = undefined;

                if(solicitud.direccion){
                    if(solicitud.pasajeros.length == 1){
                        solicitud.pasajeros[0].direccion = solicitud.direccion;
                        solicitud.pasajeros[0].telefono = solicitud.telefono;
                    }
                    SolicitudesRepository.create(vm.solicitud);
                } else {
                    angular.forEach(solicitud.pasajeros, function (pasajero) {
                        solicitud.pasajeros = [pasajero];
                        SolicitudesRepository.create(vm.solicitud);
                    });
                }
                clear();
            } else Toast('Se debe ingresar toda la información de los pasajeros');
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
            if(identificacion){
                OneRequest.to('clientes/'+identificacion).then(function (cliente) {
                    if(cliente.id) {
                        vm.solicitud.pasajeros[index] = {
                            identificacion: cliente.identificacion,
                            nombre: cliente.nombre
                        };
                        if(index == 0){
                            vm.solicitud.direccion = cliente.direccion;
                            vm.solicitud.telefono = cliente.telefono;
                        }                        
                        vm.focusNombre = true;
                        cliente.telefono && vm.telefonos.push(cliente.telefono);
                        cliente.direccion && vm.direcciones.push(cliente.direccion);
                    }
                });
            }
        }

        function clear() {
            vm.solicitud = {
                pasajeros: [{
                    identificacion: '',
                    nombre: ''
                }],
                cliente  : undefined,
                telefono : undefined,
                direccion: undefined
            }
            vm.telefonos = [];
            delete vm.direcciones;
            vm.direcciones = [];
            vm.focusId = true;
        }

        function pasarSolicitudaPendiente(solicitud){
            checkContrtante(solicitud.pasajeros[0].identificacion);
            solicitud.setAsPendiente();
        }

        function rejectSolicitud(solicitud){
            checkContrtante(solicitud.pasajeros[0].identificacion);
            solicitud.reject();
        }

        function reasignarSolicitud(solicitud, conductor) {
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
