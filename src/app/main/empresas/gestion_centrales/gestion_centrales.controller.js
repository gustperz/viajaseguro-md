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
    function EmpresaCentralesController(Centrales, Rutas, GeoCoder, NavigatorGeolocation){
        var vm = this;
        var ciudad_place = undefined;
        vm.centrales = [];
        vm.departamentos = [];

        vm.placeChanged = placeChanged;
        vm.selectCentral = selectCentral;
        vm.geocode = geocode;
        vm.save = save;
        vm.cancel = cancel;
        vm.selectRuta = selectRuta;
        vm.deleteRoute = deleteRoute;
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

        function selectRuta(ruta) {
            vm.selectedRuta = ruta;

            vm.origen_ruta = ruta.origen.ciudad+', '+ruta.origen.departamento
            vm.destino_ruta = ruta.destino.ciudad+', '+ruta.destino.departamento;

            vm.simpleMap.zoom = 10;
        }

        function deleteRoute(ruta, incex) {
            Rutas.remove(ruta).then(function () {
                vm.central.rutas.splice(incex, 1);
            });
        }
    }
})();
