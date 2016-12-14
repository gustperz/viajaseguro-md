(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('DespachoController', DespachoController);

    /** @ngInject */
    function DespachoController(Despacho, Toast, $mdDialog, $window,$http, api, Conductores, NotificacionesRepository){
        var vm = this;
        vm.despacho = Despacho;
        NotificacionesRepository.load();
        vm.detalles = detalles;
        vm.establecerContratante = establecerContratante;
        vm.despachar = despachar;

        //////////

        Despacho.contratante = JSON.parse(sessionStorage.getItem('contratante_despacho'));
        Despacho.contrato = Number(localStorage.getItem('nContrato'));

        //////////

        function detalles(event) {
            $mdDialog.show({
                controller: 'DetallesDespachoController as vm',
                templateUrl: 'app/main/centrales/despacho/detalles_despacho/detalles_despacho.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
                fullscreen: true// Only for -xs, -sm breakpoints.
            })
                .then(function() {
                    despachar();
                }, function() {

                });
        }

        function establecerContratante(pasajero) {
            vm.despacho.contratante = pasajero;
            sessionStorage.setItem('contratante_despacho', JSON.stringify(pasajero));
        }

        function despachar() {
            $mdDialog.show({
                templateUrl: 'app/main/centrales/despacho/progress.html',
                parent: angular.element(document.body),
                clickOutsideToClose:false,
                fullscreen: false
            });

            Conductores.get(Despacho.conductor.id, {populate: 'vehiculo'}).then(function (conductor) {
                Despacho.conductor = conductor;
                Despacho.conductor.nombre_completo = Despacho.conductor.nombres+' '+Despacho.conductor.apellidos;
                Despacho.conductor.fecha_licencia = moment(Despacho.conductor.fecha_licencia).format('DD-MM-YYYY');
                vm.searchText = conductor.vehiculo.placa;
                Despacho.conductor.loaded = true;

                sendDespacho();
            });
        }

        function chechDespacho(){
            if(Despacho.conductor.modalidad == 'especial' && !Despacho.contrato){
                Toast('Escribe el numero de contrato');
                return false;
            }
            else if(!Despacho.conductor.vehiculo){
                Toast('Este conductor no tiene asignado un vehiculo, no es posible realizar el despacho');
                return false;
            }
            else if(!(Despacho.sa[Despacho.conductor.id] && Despacho.sa[Despacho.conductor.id].length )) {
                Toast('No puedes realizar un despacho sin pasajeros');
                return false;
            }
            else if(Despacho.conductor.modalidad == 'especial' && !Despacho.contratante) {
                Toast('Es necesario establecer un pasajero como contratante para realizar el despacho');
                return false;
            }
            else if(!Despacho.valor_viaje){
                Toast('Y el valor del viaje?');
                return false;
            }
            else {
                return true;
            }
        }

        function sendDespacho(){
            if(chechDespacho()){
                var pasajeros = [];
                angular.forEach(Despacho.sa[Despacho.conductor.id], function (solicitud) {
                    pasajeros = pasajeros.concat(solicitud.pasajeros);
                });

                var data = {
                    trayecto: Despacho.trayecto,
                    origen: Despacho.origen.nombre,
                    destino: Despacho.destino.nombre,
                    estacion: Despacho.destino.codigo,
                    contrato: Despacho.contrato,
                    ruta: Despacho._ruta.id,
                    valor: Despacho.valor_viaje,
                    conductor: Despacho.conductor.id,
                    modalidad: Despacho.conductor.modalidad,
                    vehiculo: typeof Despacho.conductor.vehiculo == 'object' ? Despacho.conductor.vehiculo.id : Despacho.conductor.vehiculo,
                    contratante_identificacion: Despacho.contratante ? Despacho.contratante.identificacion : null,
                    contratante_nombre: Despacho.contratante ? Despacho.contratante.nombre : null,
                    pasajeros: pasajeros
                }

                var req = { method: 'POST', url: api + 'viajes', data: data};

                $http(req).then(despachoSucces, despachoError);
            }else{
                $mdDialog.cancel();
            }
        }

        function despachoSucces(response) {
            var ventimp = window.open(' ', 'popimpr');
            ventimp.document.write( response.data);
            ventimp.document.close();
            setTimeout(function () {
                ventimp.print( );
                ventimp.close();
            }, 5);
            // var file = new Blob([response.data], {type: 'application/pdf'});
            // var fileURL = URL.createObjectURL(file);
            // $window.open(fileURL);
            if(Despacho.modalidad !== 'especial'){
                if(Despacho.cont_aux) {
                    Despacho.contrato = Despacho.cont_aux;
                    delete Despacho.cont_aux
                    localStorage.setItem('nContrato', Despacho.contrato);                    
                } else {
                    localStorage.setItem('nContrato', ++Despacho.contrato);
                }
            }
            Despacho.valor_viaje = 0;
            Despacho.conductor = undefined;
            Despacho.contratante = undefined;
            Despacho.loadConductores(Despacho._ruta);
            $mdDialog.cancel();
        }

        function despachoError(error) {
            if(error.data.code === 'E_INCOMPLETE_EMPRESA_DATA'){
                Toast('Espera!, Aun faltan datos importante en tu empresa, favor notifica al gerente sobre este problema.');
                $mdDialog.cancel();
            }
            if(error.data.code === 'E_NC_USED'){
                Toast(error.data.data);
                $mdDialog.cancel();
            }
        }
    }
})();
