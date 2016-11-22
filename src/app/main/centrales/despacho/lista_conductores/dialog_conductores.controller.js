/**
 * Created by tav0 on 27/09/16.
 */

(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('DialogConductoresController', controller);

    /** @ngInject */
    function controller($mdDialog, Conductores, Despacho, authService, Centrales) {
        var vm = this;
        vm.conductores_en_estacion = [];
        vm.conductores_central = [];
        vm.otros_conductores = [];

        vm.selectConductores = selectConductores;
        vm.cancel = cancel;

        //////////

        Conductores.getList({
            fields:  'identificacion, nombres, apellidos, imagen, codigo_vial, estado, estacion, central',
            where: {activo: true, estado: {'!': 'en_turno'}}
        }).then(function (conductores) {
            angular.forEach(conductores.plain(), function(conductor) {
                if(conductor.estacion == Despacho.origen.codigo && ['en_ruta'].indexOf(conductor.estado) != -1) {
                    vm.conductores_en_estacion.push(conductor);
                }
                else if(conductor.central == authService.getCurrentUser().central.id) {
                    vm.conductores_central.push(conductor);
                }
                else {
                    vm.otros_conductores.push(conductor);
                }
            });
            Centrales.getList({fields: 'ciudad', where: { id: {'!': authService.getCurrentUser().central.id } } })
            .then(function (centrales){
                angular.forEach(centrales, function(central) {
                    central.conductores = vm.otros_conductores.filter(function(conductor){
                        return conductor.central == central.id;
                    });
                });
                vm.centrales = centrales.plain();
            });
        })

        //////////

        function selectConductores() {
            var conductores = vm.conductores_en_estacion.filter(function(conductor) {
                if (conductor.selected) return conductor;
            });
            conductores.concat(vm.conductores_central.filter(function(conductor) {
                if (conductor.selected) return conductor;
            }));
            angular.forEach(vm.centrales, function(central) {
                angular.forEach(central.conductores, function(conductor) {
                    if (conductor.selected) conductores.push(conductor);
                });
            });
            $mdDialog.hide(conductores);
        };

        function cancel() {
            $mdDialog.cancel();
        };
    }
})();
