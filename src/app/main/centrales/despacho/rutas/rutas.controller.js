/**
 * Created by tav0 on 26/09/16.
 */

(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('RutasDespachoController', RutasController);

    /** @ngInject */
    function RutasController(Despacho, authService, Centrales, $mdMenu, Toast){
        var vm = this;
        vm.ciudades_origen = {};

        vm.addDestino = addDestino;
        vm.addOrigen = addOrigen;
        vm.OrigenChanged = OrigenChanged;
        vm.DestinoChanged = DestinoChanged;
        vm.selectOrigen = selectOrigen;
        vm.selectDestino = selectDestino;
        vm.cancel = cancel;


        //////////

        loadRutas();

        //////////

        function loadRutas() {
            var origen = sessionStorage.getItem('ciudades_origen');
            if(origen) {
                vm.ciudades_origen = JSON.parse(origen);
                var key = Object.keys(vm.ciudades_origen)[0];
                Despacho.origen = {
                    codigo: vm.ciudades_origen[key].codigo,
                    nombre: vm.ciudades_origen[key].nombre
                };
            } else {
                Centrales.get(authService.getCurrentUser().central.id, {fields: 'ciudad', populate: 'ciudad,rutas'})
                    .then(function (central) {
                        angular.forEach(central.rutas, function (ruta, index) {
                            if (vm.ciudades_origen[ruta.origen.ciudad_place_id]){
                                vm.ciudades_origen[ruta.origen.ciudad_place_id].rutas.push({
                                    nombre_ciudad: ruta.destino.ciudad,
                                    destino: ruta.destino.ciudad_place_id,
                                    trayecto: ruta.trayecto,
                                    id: ruta.id
                                });
                            }else{
                                vm.ciudades_origen[ruta.origen.ciudad_place_id] = {
                                    nombre: ruta.origen.ciudad,
                                    codigo: ruta.origen.ciudad_place_id,
                                    rutas: [{
                                        nombre_ciudad: ruta.destino.ciudad,
                                        destino: ruta.destino.ciudad_place_id,
                                        trayecto: ruta.trayecto,
                                        id: ruta.id
                                    }]
                                };
                            }
                        });
                        selectOrigen(vm.ciudades_origen[central.rutas[0].origen.ciudad_place_id]);
                    });
            }
        }

        function OrigenChanged() {
            var place = this.getPlace();
            vm.ciudad_origen = {
                nombre: place.name,
                codigo: place.place_id
            }
        }

        function addOrigen() {
            Centrales.getList({fields: 'id', ciudad_place_id: vm.ciudad_origen.codigo, empresa: authService.getCurrentUser().empresa.id})
                .then(function (central) {
                    if(central.length){
                        Toast('No se puede seleccionar '+vm.ciudad_origen.nombre+' como origen, los despachos desde esa ciudad, los debe hacer la central local')
                    } else {
                        vm.ciudades_origen[ciudad.codigo] = {
                            nombre: vm.ciudad_origen.nombre,
                            codigo: vm.ciudad_origen.codigo,
                            rutas: []
                        };
                        sessionStorage.setItem('ciudades_origen', JSON.stringify(vm.ciudades_origen));
                        selectOrigen(vm.ciudad_origen);
                        vm.ciudad_origen = undefined;
                        $mdMenu.hide();
                    }
                });
        }

        function DestinoChanged() {
            var place = this.getPlace();
            vm.ciudad_destino = {
                nombre_ciudad: place.name,
                destino: place.place_id,
                no_central: true
            };
        }

        function addDestino() {
            vm.ciudad_destino.trayecto = vm.trayecto,
            vm.ciudades_origen[Despacho.origen.codigo].rutas.push(vm.ciudad_destino);
            sessionStorage.setItem('ciudades_origen', JSON.stringify(vm.ciudades_origen));
            selectDestino(vm.ciudad_destino);
            vm.ciudad_destino = undefined;
            $mdMenu.hide();
        }

        function selectOrigen(ciudad) {
            Despacho.origen = {
                codigo: ciudad.codigo,
                nombre: ciudad.nombre
            };
            if(ciudad.rutas.length === 1){
                selectDestino(ciudad.rutas[0]);
            }else {
                Despacho.destino = undefined;
            }
        }

        function selectDestino(ruta) {
            Despacho.destino = {
                codigo: ruta.destino,
                nombre: ruta.nombre_ciudad
            };
            Despacho.trayecto = ruta.trayecto[0];
            Despacho.trayectos = ruta.trayecto;
            Despacho.loadConductores(ruta);
            Despacho.loadDespachados(ruta.id);
        }

        function cancel(campo) {
            vm[campo] = undefined;
            vm.trayecto_ruta = '';
            $mdMenu.hide();
        }
    }
})();
