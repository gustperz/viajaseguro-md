/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.empresas.gestion_centrales')
        .controller('InfoCentralesController', Controller);

    /** @ngInject */
    function Controller($mdDialog, OneRequest, Toast){
        var vm = this;
        vm.centrales = [];
        vm.departamentos = [];

        vm.editarRuta = editarRuta;
        vm.cambiarPassCentral = cambiarPassCentral;
        vm.editarDespachador = editarDespachador;
        vm.eliminarCentral = eliminarCentral;
        vm.nuevaRuta = nuevaRuta;

        //////////

        //////////

        function cambiarPassCentral(ev, central) {
            $mdDialog.show({
                templateUrl: 'app/main/empresas/gestion_centrales/info_central/dialog_cambiar_contraseña.tmpl.html',
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
                OneRequest.put('user/'+central.user.id+'/updateContrasena', user).then(function () {
                    Toast('Contrase&ntilde;a actualizada correctamente');
                });
            });
        }

        function editarDespachador(ev, central) {
            $mdDialog.show({
                templateUrl: 'app/main/empresas/gestion_centrales/info_central/dialog_despachador.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: true,
                locals: {
                    user: central.despachador
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
                    OneRequest.post('centrales/'+central.id+'/despachador', user).then(function () {
                        Toast('Despachador asignado a la central');
                        // selectCentral(central);
                    });
                } else {
                    OneRequest.put('centrales/'+central.id+'/despachador', user).then(function () {
                        Toast('Datos despachador actualizados correctamente');
                        // selectCentral(central);
                    });
                }
            });
        }

        function editarRuta(ev, ruta, central, index) {
            $mdDialog.show({
                templateUrl: 'app/main/empresas/gestion_centrales/info_central/dialog_editar_ruta.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                fullscreen: true,
                controllerAs: 'vm',
                controller: 'EditarRutaCentralController',
                locals: {
                    ruta: ruta
                }
            }).then(function(ruta) {
                if(ruta == 'deleted') {
                    central.rutas.splice(index, 1);
                } else {
                    central.rutas[index] = ruta;
                }
            });
        }
        
        function eliminarCentral() {
            vm.central.remove().then(function () {
                vm.central = undefined;
                loadCentrales();
            });
        }

        function nuevaRuta(ev, central) {
            $mdDialog.show({
                templateUrl: 'app/main/empresas/gestion_centrales/info_central/dialog_nueva_ruta.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                fullscreen: true,
                controllerAs: 'vm',
                controller: 'NuevaRutaCentralController',
                locals: {
                    central_id: central.id
                }
            }).then(function(ruta) {
                central.rutas.push(ruta);
            });
        }

    }
})();
