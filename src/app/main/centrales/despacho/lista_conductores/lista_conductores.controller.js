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
    function controller(Despacho, Rutas, $mdDialog, Solicitudes){
        var vm = this;
        var ruta = {};

        vm.turnos = [];

        vm.addConductor = addConductor;
        vm.updateTurnos = updateTurnos;
        vm.removerConductor = removerConductor;
        vm.selectConductor = selectConductor;

        //////////

        Despacho.loadConductores = loadConductores;

        //////////

        function selectConductor(conductor) {
            vm.selectedConductor = Despacho.conductor = conductor;
            if(conductor) {
                Despacho.conductor.cupos = 4;
                var nSolicitudes = Solicitudes.getAsignadas()[Despacho.conductor.id] ? Solicitudes.getAsignadas()[Despacho.conductor.id].length : 0;
                Despacho.cupos_disponibles = 4 - nSolicitudes;
            }
        }

        function loadConductores(_ruta) {
            if(_ruta.no_central) {
                ruta = Despacho._ruta = _ruta;
                return loadConductoresLocalStorage(ruta);
            }

            ruta = Despacho._ruta = Rutas.get(_ruta.id);
            ruta.getList('turnos').then(function (turnos) {
                vm.turnos = turnos;
                selectConductorPos1();
            });
        }

        function loadConductoresLocalStorage(ruta) {
            var turnos = sessionStorage.getItem('turnosruta'+ruta.destino);
            vm.turnos = turnos ? JSON.parse(turnos) : [];
            selectConductorPos1();
        }

        function selectConductorPos1() {
            var turno1 = vm.turnos.find(function (turno) {
                return turno.pos === 1;
            });
            vm.selectedConductor = turno1 ? turno1.conductor : undefined;
            selectConductor(vm.selectedConductor);
        }

        function addConductor(event) {
            $mdDialog.show({
                controller: 'DialogConductoresController as vm',
                templateUrl: 'app/main/centrales/despacho/lista_conductores/dialog_conductores.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
            }).then(function (conductores) {
                console.log(conductores)
                if(ruta.no_central) return addConductoresLocalStorage(conductores);

                var turnos = vm.turnos.map(function (turno, index) {
                    turno.pos = index + 1;
                    return { pos: turno.pos, conductor: turno.conductor.id };
                });
                conductores.forEach(function (conductor) {
                    var pos = vm.turnos.length + 1;
                    vm.turnos.push({ pos: pos, conductor: conductor });
                    turnos.push({ pos: pos, conductor: conductor.id, isNew: true });
                });
                ruta.post('turnos', {turnos: turnos});
            }, function () {});
        }

        function addConductoresLocalStorage(conductores) {
            conductores.forEach(function (conductor) {
                var pos = vm.turnos.length + 1;
                vm.turnos.push({ pos: pos, conductor: conductor });
            });
            updateTurnosLocalStorage();
        }

        function updateTurnos() {
            if(ruta.no_central) return updateTurnosLocalStorage();

            var turnos = vm.turnos.map(function (turno, index) {
                turno.pos = index + 1;
                return { pos: turno.pos, conductor: turno.conductor.id };
            });
            ruta.post('turnos', {turnos: turnos})
        }

        function updateTurnosLocalStorage() {
            vm.turnos.forEach(function (turno, index) {
                turno.pos = index + 1;
            });
            sessionStorage.setItem('turnosruta'+ruta.destino, JSON.stringify(vm.turnos));
        }

        function removerConductor(index) {
            if(ruta.no_central) {
                vm.turnos.splice(index, 1);
                return updateTurnosLocalStorage();
            }

            var turnos = [{ pos: -1, conductor: vm.turnos[index].conductor.id }];
            vm.turnos.splice(index, 1);
            vm.turnos.forEach(function (turno, index) {
                turno.pos = index + 1;
                turnos.push({ pos: turno.pos, conductor: turno.conductor.id });
            });
            ruta.post('turnos', {turnos: turnos});
        }
    }
})();
