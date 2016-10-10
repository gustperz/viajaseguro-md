/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.empresas.gestion_centrales')
        .controller('EmpresaCentralesController', EmpresaCentralesController);

    /** @ngInject */
    function EmpresaCentralesController(Rutas, Centrales, OneRequest, GeoCoder, NavigatorGeolocation, $mdMenu){
        var vm = this;
        var ciudad_place = undefined;
        vm.centrales = [];
        vm.departamentos = [];

        vm.placeChanged = placeChanged;
        vm.selectCentral = selectCentral;
        vm.geocode = geocode;
        vm.save = save;
        vm.cancel = cancel;
        vm.saveNewRuta = saveNewRuta;
        vm.cancelNewRuta = cancelNewRuta;
        vm.selectRuta = selectRuta;
        vm.showCrearCentral = showCrearCentral;

        //////////

        loadCentrales();
        currentPos();

        //////////

        function loadCentrales() {
            Centrales.getList({fields: 'id, ciudad, direccion'}).then(function (centrales) {
                vm.centrales = centrales;
            })
        }

        function selectCentral(central) {
            vm.central = central;
            vm.destino_ruta = '';
            vm.selectedRuta = undefined;
            vm.simpleMap = {};
            central.get({populate: 'user,rutas'}).then(function (central) {
                vm.simpleMap = {
                    center: {
                        lat: central.pos_lat,
                        lng: central.pos_lng
                    },
                    zoom: 16
                };
                vm.my_position =  [central.pos_lat, central.pos_lng].toString();
                vm.central = central;
            });
        }

        function showCrearCentral() {
            vm.central = {};
            vm.crearCentral = true;
            vm.ciudad_place = '';
            vm.destino_ruta = '';
            vm.selectedRuta = undefined;
            vm.simpleMap = {};
        }

        function placeChanged() {
            var place = this.getPlace();

            vm.central.ciudad_place_id = place.place_id;
            vm.central.ciudad = place.name;
            vm.central.departamento = place.address_components.find(function (component) {
                return component.types[0] === 'administrative_area_level_1';
            }).long_name;

            ciudad_place = place;
            geocode();
        }

        function geocode() {
            if (!ciudad_place) return;
            var direccion = vm.central.direccion+', '+ciudad_place.formatted_address;
            GeoCoder.geocode({address: direccion}).then(function(result) {
                var firstAddress = result[0],
                    lat = firstAddress.geometry.location.lat(),
                    lng = firstAddress.geometry.location.lng();

                console.log(vm.central, firstAddress)
                vm.central.pos_lat = lat;
                vm.central.pos_lng = lng;
                vm.central.place_id = firstAddress.place_id;
                vm.central.address_components_raw = firstAddress.address_components;

                vm.simpleMap = {
                    center: {
                        lat: lat,
                        lng: lng
                    },
                    zoom: 16
                };
                vm.my_position =  [lat, lng].toString();
            });
        }

        function save() {
            Centrales.create(vm.central).then(function (central) {
                selectCentral(central);
                loadCentrales();
                vm.crearCentral = false;
            })
        }

        function cancel() {
            vm.central = undefined;
            vm.crearCentral = false;
        }

        function saveNewRuta() {
            Rutas.create({
                nombre_ciudad: vm.selectedCiudad.nombre,
                trayecto: vm.trayecto_ruta,
                origen: vm.central.id,
                destino: vm.selectedCiudad.codigo
            }).then(function (ruta) {
                vm.selectedCiudad = '';
                vm.selectedCentral = '';
                vm.searchText = '';
                vm.searchTextD = '';
                vm.trayecto_ruta = '';
                vm.central.rutas.push(ruta.plain());
                selectRuta(ruta.plain());
                $mdMenu.hide()
            })
        }

        function cancelNewRuta() {
            vm.selectedCiudad = '';
            vm.selectedCentral = '';
            vm.searchText = '';
            vm.searchTextD = '';
            vm.trayecto_ruta = '';
            $mdMenu.hide()
        }

        function selectRuta(ruta) {
            vm.selectedRuta = ruta;

            vm.origen_ruta = vm.central.direccion+', '+vm.central.ciudad.nombre+', '+getdepartamento(vm.central.ciudad.departamento);

            var central = vm.centrales.find(function(central) {return central.ciudad.codigo === ruta.destino;});
            if( central ){
                vm.destino_ruta = central.direccion+', '+central.ciudad.nombre+', '+getdepartamento(central.ciudad.departamento);
            } else {
                OneRequest.to('/ciudades', {'codigo': ruta.destino}, true).then(function (ciudades) {
                    vm.destino_ruta = ciudades[0].nombre+', '+getdepartamento(ciudades[0].departamento);
                });
            }
            vm.simpleMap.zoom = 10;
        }

        function currentPos() {
            NavigatorGeolocation.getCurrentPosition()
                .then(function(position) {
                    var lat = position.coords.latitude, lng = position.coords.longitude;
                    vm.simpleMap= {
                        center: {
                            lat: lat,
                            lng: lng
                        },
                        zoom: 8
                    };
                });
        }
    }
})();
