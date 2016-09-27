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
        vm.selectOrigen = selectOrigen;
        vm.selectDestino = selectDestino;

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
                        vm.ciudades_origen[central.ciudad.codigo] = {
                            nombre: central.ciudad.nombre,
                            codigo: central.ciudad.codigo,
                            rutas: central.rutas
                        }
                        Despacho.origen = {
                            codigo: central.ciudad.codigo,
                            nombre:central.ciudad.nombre
                        };
                    });
            }
        }

        function addOrigen(ciudad) {
            Centrales.getList({fields: 'id', ciudad: ciudad.codigo, empresa: authService.getCurrentUser().empresa.id})
                .then(function (central) {
                    if(central.length){
                        Toast('No se puede seleccionar '+ciudad.nombre+' como origen, los despachos desde esa ciudad, los debe hacer la central local')
                    } else {
                        vm.ciudades_origen[ciudad.codigo] = {
                            nombre: ciudad.nombre,
                            codigo: ciudad.codigo,
                            rutas: []
                        };
                        sessionStorage.setItem('ciudades_origen', JSON.stringify(vm.ciudades_origen));
                        Despacho.origen = {
                            codigo: ciudad.codigo,
                            nombre: ciudad.nombre
                        }
                        $mdMenu.hide();
                    }
                });
        }

        function addDestino(ciudad, trayecto) {
            vm.ciudades_origen[Despacho.origen.codigo].rutas.push({
                nombre_ciudad: ciudad.nombre,
                destino: ciudad.codigo,
                trayecto: trayecto
            });
            sessionStorage.setItem('ciudades_origen', JSON.stringify(vm.ciudades_origen));
            Despacho.destino = {
                codigo: ciudad.codigo,
                nombre: ciudad.nombre
            };
            $mdMenu.hide();
        }

        function selectOrigen(ciudad) {
            Despacho.origen = {
                codigo: ciudad.codigo,
                nombre: ciudad.nombre
            };
            Despacho.destino = undefined;
        }

        function selectDestino(ruta) {
            Despacho.destino = {
                codigo: ruta.destino,
                nombre: ruta.nombre_ciudad
            };
            Despacho.loadConductores(ruta);
        }
    }
})();
