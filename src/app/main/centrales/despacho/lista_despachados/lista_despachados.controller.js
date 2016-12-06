/**
 * Created by jose on 28/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('ListaDespachadosController', controller);

    function controller(Viajes, authService, $filter, $sails, Despacho, SolicitudesRepository) {
        var vm = this;

        vm.anular = anular;

        /////////

        $sails.on('makingDespacho', function () {
            loadViajes();
        });
    
        Despacho.loadDespachados = function(ruta){
            vm.ruta = ruta;
            $sails.on('turnosRuta'+ruta+'Changed', function () {
                loadViajes();
            });
            loadViajes();
        }

        //////////
        
        function loadViajes() {
            Viajes.getList({
                fields: 'id,conductor,pasajeros,fuec',
                where:{
                    central: authService.getCurrentUser().central.id,
                    ruta: vm.ruta,
                    createdAt: {'>=': $filter('date')(new Date(), 'yyyy-MM-dd')}
                }, 
                limit: 5,
                sort: 'createdAt DESC',
                populate: 'conductor, vehiculo'
            }).then(function (response) {
                vm.viajes = [];
                angular.forEach(response, function(viaje){
                    if(viaje.conductor.estado == 'en_ruta'){
                        var ya_esta = vm.viajes.find(function(_viaje){
                            return _viaje.conductor.id === viaje.conductor.id;
                        });
                        if(!ya_esta) {
                            vm.viajes.push(viaje);
                        }
                    }                    
                });
            }, function (error) {
                console.log(error);
            });
        }

        function anular(viaje) {
            var numero = viaje.fuec;
            reloadSolicitudes(viaje);
            addTurno(viaje.conductor)
        }

        function reloadSolicitudes(viaje) {
            angular.forEach(viaje.pasajeros, function (pasajero) {
                var solicitud = {
                    conductor: viaje.conductor.id,
                    codigo_ruta: Despacho.destino.codigo,
                    tipo: 'Pasajeros',
                    estado: 'a',
                    direccion: pasajero.direccion,
                    telefono: pasajero.telefono,
                    pasajeros: [pasajero],
                    cliente: undefined
                };
                SolicitudesRepository.create(solicitud);
            });
        }

        function addTurno(conductor) {
            var turnos = Despacho.getTurnos();
            turnos.unshift({
                conductor: conductor, 
                isNew: true
            });
            turnos = turnos.map(function (turno, index) {
                return {
                    pos: index + 1, 
                    conductor: turno.conductor.id, 
                    isNew: turno.isNew};
            })
            Despacho.conductor = conductor;
            Despacho._ruta.updateTurnos(turnos).then(function(){
                Despacho.selectConductor(conductor);
            });
        }
    }
})();
//