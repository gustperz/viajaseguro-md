/**
 * Created by jose on 28/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('ListaSolicitudesController', controller);

    function controller(Solitudes, $mdMenu, Despacho) {
        var vm = this;
        vm.solicitud = {};

        // metodos
        vm.cancelNesSolicitud = cancelNewSolicitud;
        vm.saveNewSolicitud = saveNewSolicitud;
        vm.rejectSolicitud = rejectSolicitud;
        vm.assignSolicitudConductor = assignSolicitudConductor;

        //////////

        Solitudes.getList(function (solicitudes) {
            vm.solicitudes = solicitudes;
        });

        //////////

        function cancelNewSolicitud() {
            vm.solicitud = {};
            $mdMenu.hide();
        }

        function saveNewSolicitud() {
            vm.solicitud.pasajeros = [vm.solicitud.cliente];
            Solitudes.create(vm.solicitud);
            $mdMenu.hide();
        }

        function rejectSolicitud(solicitud) {
            solicitud.reject();
        }

        function assignSolicitudConductor($index, conductor) {
            var solicitud = vm.solicitudes[$index];
            solicitud.conductor = conductor;
            vm.solicitudes.splice($index, 1);
            sessionStorage.setItem('solicitudes', JSON.stringify(vm.solicitudes));
            vm.solicitudesConductores.push(solicitud);
            sessionStorage.setItem('solicitudesConductores', JSON.stringify(vm.solicitudesConductores));
        }
    }
})();
//