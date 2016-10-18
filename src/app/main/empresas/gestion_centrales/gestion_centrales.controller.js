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
    function EmpresaCentralesController(Centrales, Rutas, GeoCoder, NavigatorGeolocation, $mdDialog, OneRequest, Toast){
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
        vm.cambiarPassCentral = cambiarPassCentral;
        vm.editarDespachador = editarDespachador;

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
            central.get({populate: 'user,rutas,despachador'}).then(function (central) {
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

        function cambiarPassCentral(ev) {
            $mdDialog.show({
                templateUrl: 'app/main/empresas/gestion_centrales/dialog_cambiar_contraseña.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: true,
                controllerAs: 'vm',
                controller: function () {
                    var vm = this;
                    vm.hide = function() {
                        $mdDialog.hide(vm.user);
                    };
                    vm.cancel = $mdDialog.cancel;
                }
            }).then(function(user) {
                OneRequest.put('user/'+vm.central.user.id+'/updateContrasena', user).then(function () {
                    Toast('Contrase&ntilde;a actualizada correctamente');
                });
            });
        }

        function editarDespachador(ev) {
            $mdDialog.show({
                templateUrl: 'app/main/empresas/gestion_centrales/dialog_despachador.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: true,
                locals: {
                    user: vm.central.despachador
                },
                controllerAs: 'vm',
                controller: function (user) {
                    var vm = this;
                    vm.user = user ? user : {'new': true};
                    vm.user.activo = vm.user.rol == 'DESPACHADOR_EMPRESA_DES' ? false : true;
                    vm.hide = function() {
                        $mdDialog.hide(vm.user);
                    };
                    vm.cancel = $mdDialog.cancel;
                }
            }).then(function(user) {
                if(user.new){
                    OneRequest.post('centrales/'+vm.central.id+'/despachador', user).then(function () {
                        Toast('Despachador asignado a la central');
                        selectCentral(vm.central);
                    });
                } else {
                    OneRequest.put('centrales/'+vm.central.id+'/despachador', user).then(function () {
                        Toast('Datos despachador actualizados correctamente');
                        selectCentral(vm.central);
                    });
                }
            });
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
