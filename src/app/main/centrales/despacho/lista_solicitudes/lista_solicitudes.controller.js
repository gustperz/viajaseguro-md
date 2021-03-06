/**
 * Created by jose on 28/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('ListaSolicitudesController', controller);

    function controller(SolicitudesRepository, $mdMenu, Despacho) {
        var vm = this;
        vm.solicitud = {};

        // metodos
        vm.cancelNesSolicitud = cancelNewSolicitud;
        vm.saveNewSolicitud = saveNewSolicitud;
        vm.rejectSolicitud = rejectSolicitud;
        vm.assignSolicitudConductor = assignSolicitudConductor;

        //////////

        SolicitudesRepository.load()

        //////////

        function cancelNewSolicitud() {
            vm.solicitud = {};
            $mdMenu.hide();
        }

        function saveNewSolicitud() {
            vm.solicitud.pasajeros = [vm.solicitud.cliente];
            SolicitudesRepository.create(vm.solicitud);
            $mdMenu.hide();
        }

        function rejectSolicitud(solicitud) {
            solicitud.reject();
        }

        function assignSolicitudConductor(solicitud, conductor) {
            solicitud.assignTo(conductor);
        }
    }
})();
//