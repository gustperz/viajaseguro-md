/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.empresas.gestion_centrales')
        .controller('NuevaRutaCentralController', controller);

    /** @ngInject */
    function controller(Rutas, $mdDialog, central_id){
        var vm = this;
        vm.trayecto_ruta = [];

        vm.DestinoChanged = DestinoChanged;
        vm.OrigenChanged = OrigenChanged;
        vm.saveNewRuta = saveNewRuta;
        vm.cancel = cancel;

        //////////

        //////////

        function OrigenChanged() {
            var place = this.getPlace();
            vm.origen = {
                ciudad_place_id: place.place_id,
                ciudad: place.name,
                departamento: place.address_components.find(function (component) {
                    return component.types[0] === 'administrative_area_level_1';
                }).long_name,
                address_components_raw: place.address_components,
            }
        }

        function DestinoChanged() {
            var place = this.getPlace();
            vm.destino = {
                ciudad_place_id: place.place_id,
                ciudad: place.name,
                departamento: place.address_components.find(function (component) {
                    return component.types[0] === 'administrative_area_level_1';
                }).long_name,
                address_components_raw: place.address_components,
            }
        }

        function saveNewRuta() {
            Rutas.create({
                trayecto: vm.trayecto_ruta,
                origen: vm.origen,
                destino: vm.destino,
                central: central_id
            }).then(function (ruta) {
                $mdDialog.hide(ruta.plain());
            })
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function deleteRoute(ruta, central, incex) {
            Rutas.remove(ruta).then(function () {
                central.rutas.splice(incex, 1);
            });
        }

    }
})();
