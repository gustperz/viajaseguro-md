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
        vm.centrales = [];

        vm.querySearch = querySearch;
        vm.loadCiudades = loadCiudades;
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
        loadDepartamentos();

        //////////

        function loadCentrales() {
            Centrales.getList({fields: 'id, ciudad, direccion', populate: 'ciudad'}).then(function (centrales) {
                vm.centrales = centrales;
            })
        }

        function loadDepartamentos() {
            OneRequest.to('/departamentos', null, true).then(function (departamentos) {
                vm.departamentos = departamentos;
            })
        }

        function loadCiudades(departamento) {
            OneRequest.to('/ciudades', {'departamento': departamento}, true).then(function (ciudades) {
                vm.ciudades = ciudades;
            });
        }

        function selectCentral(central) {
            vm.central = central;
            vm.destino_ruta = '';
            vm.selectedRuta = undefined;
            vm.simpleMap = {};
            central.get({populate: 'user,ciudad,rutas'}).then(function (central) {
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
            vm.selectedCiudad = '';
            vm.selectedCentral = '';
            vm.searchText = '';
            vm.searchTextD = '';
            vm.destino_ruta = '';
            vm.selectedRuta = undefined;
            vm.simpleMap = {};
        }

        function save() {
            vm.central.ciudad = vm.selectedCiudad.codigo;
            Centrales.create(vm.central).then(function (central) {
                selectCentral(central);
                loadCentrales();
                vm.selectedCiudad = '';
                vm.selectedCentral = '';
                vm.searchText = '';
                vm.searchTextD = '';
                vm.crearCentral = false;
            })
        }

        function cancel() {
            vm.central = undefined;
            vm.crearCentral = false;
            vm.selectedCiudad = '';
            vm.selectedCentral = '';
            vm.searchText = '';
            vm.searchTextD = '';
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

        function getdepartamento(id) {
            return vm.departamentos.find(function(departamento) {return departamento.id === id;}).nombre;
        }

        function geocode() {
            if (!vm.selectedCiudad || !vm.selectedDepartamento || !vm.central.direccion) return;
            var direccion = vm.central.direccion+', '+vm.selectedCiudad.nombre+', '+vm.selectedDepartamento.nombre;
            GeoCoder.geocode({address: direccion}).then(function(result) {
                var firstAddress = result[0],
                    lat = firstAddress.geometry.location.lat(),
                    lng = firstAddress.geometry.location.lng();

                vm.central.pos_lat = lat;
                vm.central.pos_lng = lng;
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

        function querySearch (query, collection) {
            var results = query ? collection.filter( createFilterFor(query) ) : collection;
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function(item) {
                return (angular.lowercase(item.nombre).indexOf(lowercaseQuery) != -1);
            };

        }
    }
})();
