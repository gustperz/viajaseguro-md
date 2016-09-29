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
        var ruta = {};

        vm.turnos = [];

        vm.addConductor = addConductor;
        vm.updateTurnos = updateTurnos;

        //////////

        Despacho.loadConductores = loadConductores;

        //////////

        function loadConductores(_ruta) {
            ruta = Despacho._ruta = Rutas.get(_ruta.id);
            ruta.getList('turnos').then(function (turnos) {
                vm.turnos = turnos.plain();
            });
        }

        function addConductor(event) {
            $mdDialog.show({
                controller: 'DialogConductoresController as vm',
                templateUrl: 'app/main/centrales/despacho/lista_conductores/dialog_conductores.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
            }).then(function (conductores) {
                conductores.forEach(function (conductor) {
                    vm.turnos.push({
                        pos: vm.turnos.length + 1,
                        conductor: conductor
                    });
                })
                updateTurnos();
            }, function () {});
        }
        
        function updateTurnos() {
            console.log(vm.turnos)
            var turnos = vm.turnos.map(function (turno, index) {
                turno.pos = index + 1;
                return { pos: turno.pos, conductor: turno.conductor.id };
            })
            ruta.post('turnos', {turnos: turnos})
        }
    }
})();
