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
    function controller(Rutas, $mdMenu, $scope){
        var vm = this;

        vm.DestinoChanged = DestinoChanged;
        vm.OrigenChanged = OrigenChanged;
        vm.saveNewRuta = saveNewRuta;
        vm.cancelNewRuta = cancelNewRuta;

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

        function saveNewRuta(central) {
            Rutas.create({
                trayecto: vm.trayecto_ruta,
                origen: vm.origen,
                destino: vm.destino,
                central: central.id
            }).then(function (ruta) {
                central.rutas.push(ruta.plain());
                cancelNewRuta();
                $scope.vm.selectRuta(ruta.plain());
            })
        }

        function cancelNewRuta() {
            vm.origen_place = '';
            vm.destino_place = '';
            vm.trayecto_ruta = '';
            $mdMenu.hide()
        }
    }
})();
