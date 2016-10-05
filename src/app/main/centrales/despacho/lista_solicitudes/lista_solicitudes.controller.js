/**
 * Created by jose on 28/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('ListaSolicitudesController', controller);

    function controller(Solicitudes, SolicitudesData, $mdMenu, Despacho) {
        var vm = this;
        vm.solicitud = {};

        // metodos
        vm.cancelNesSolicitud = cancelNewSolicitud;
        vm.saveNewSolicitud = saveNewSolicitud;
        vm.rejectSolicitud = rejectSolicitud;
        vm.assignSolicitudConductor = assignSolicitudConductor;

        //////////

        Solicitudes.load()
        vm.solicitudes = SolicitudesData ;
        console.log(SolicitudesData.solicitudes);

        //////////

        function cancelNewSolicitud() {
            vm.solicitud = {};
            $mdMenu.hide();
        }

        function saveNewSolicitud() {
            vm.solicitud.pasajeros = [vm.solicitud.cliente];
            Solicitudes.create(vm.solicitud);
            $mdMenu.hide();
        }

        function rejectSolicitud(solicitud) {
            solicitud.reject();
        }

        function assignSolicitudConductor(solicitud, conductor) {
            Despacho.cupos_disponibles = Despacho.cupos_disponibles - solicitud.pasajeros.length;
            solicitud.assignTo(conductor);
        }
    }
})();
//