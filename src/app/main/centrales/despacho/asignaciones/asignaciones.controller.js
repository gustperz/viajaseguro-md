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
            var all_data = vm.solicitud.pasajeros.every(function(pasajero) {
                return pasajero.identificacion != '' && pasajero.nombre != ''
            });

            if(all_data) {
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
            OneRequest.to('clientes/'+identificacion).then(function (cliente) {
                if(cliente.id) {
                    vm.solicitud.pasajeros[index] = {
                        identificacion: cliente.identificacion,
                        nombre: cliente.nombre
                    };
                    vm.focusNombre = true;
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
