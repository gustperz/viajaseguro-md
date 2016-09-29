/**
 * Created by jose on 28/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('ListaSolicitudesController', controller);

    function controller(SocketcSailsService, $sails, $mdMenu) {
        var vmsolicitudes = this;
        vmsolicitudes.solicitud = {};
        vmsolicitudes.solicitudes = JSON.parse(sessionStorage.getItem('solicitudes')) || [];

        // metodos
        vmsolicitudes.cancelNesSolicitud = cancelNewSolicitud;
        vmsolicitudes.saveNewSolicitud = saveNewSolicitud;
        vmsolicitudes.rejectSolicitud = rejectSolicitud;

        $sails.on('newSolicitud', function (response) {
            vmsolicitudes.solicitudes.push(SocketcSailsService.newSolicitud(response));
        });

        function cancelNewSolicitud() {
            vmsolicitudes.solicitud = {};
            $mdMenu.hide();
        }

        function saveNewSolicitud() {
            vmsolicitudes.solicitudes.push(vmsolicitudes.solicitud);
            sessionStorage.setItem('solicitudes', JSON.stringify(vmsolicitudes.solicitudes));
            $mdMenu.hide();
        }

        function rejectSolicitud($index) {
            var solicitud = vmsolicitudes.solicitudes[$index];
            if(solicitud.id){
                $sails.request({
                    method: 'post',
                    url: '/centrales/reject_solicitud' ,
                    data: solicitud,
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                    }
                }, function (response) {
                    console.log(response)
                    if (response.code == 'OK'){
                        vmsolicitudes.solicitudes.splice($index, 1);
                        sessionStorage.setItem('solicitudes', JSON.stringify(vmsolicitudes.solicitudes));
                    }else{
                        console.log('fallo')
                    }
                });
            }else{
                vmsolicitudes.solicitudes.splice($index, 1);
                sessionStorage.setItem('solicitudes', JSON.stringify(vmsolicitudes.solicitudes));
            }
        }

    }
})();
//