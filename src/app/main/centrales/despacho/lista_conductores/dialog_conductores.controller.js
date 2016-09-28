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
    function controller($mdDialog, Conductores, Despacho) {
        var vm = this;

        vm.selectConductores = selectConductores;
        vm.cancel = cancel;

        //////////

        Conductores.getList({
            fields:  'identificacion, nombres, apellidos, imagen, codigo_vial',
            where: {activo: true, estacion: Despacho.origen.codigo}
        }).then(function (conductores) {
            vm.conductores = conductores.plain();
        })

        //////////

        function selectConductores() {
            $mdDialog.hide(vm.conductores.filter(function(conductor) {
                if (conductor.selected) return conductor;
            }));
        };

        function cancel() {
            $mdDialog.cancel();
        };
    }
})();
