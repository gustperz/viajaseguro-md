/**
 * Created by tav0 on 27/09/16.
 */

(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('ListaConductoresController', controller);

    /** @ngInject */
    function controller(Despacho, Rutas, $mdDialog){
        var vm = this;

        vm.addConductor = addConductor;

        //////////

        Despacho.loadConductores = loadConductores;

        //////////

        function loadConductores(ruta) {
            var ruta = Despacho._ruta = Rutas.get(ruta.id);
            vm.turnos = ruta.getList('turnos');
        }

        function addConductor(event) {
            $mdDialog.show({
                controller: 'DialogConductoresController as vm',
                templateUrl: 'app/main/centrales/despacho/lista_conductores/dialog_conductores.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
            }).then(function (conductores) {
                console.log(conductores);
            }, function () {});
        }
    }
})();
