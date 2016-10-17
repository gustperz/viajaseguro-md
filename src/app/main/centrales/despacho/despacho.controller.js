(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('DespachoController', DespachoController);

    /** @ngInject */
    function DespachoController(Despacho, Toast, $mdDialog, OneRequest){
        var vm = this;
        vm.despacho = Despacho;

        vm.detalles = detalles;
        vm.establecerContratante = establecerContratante;
        vm.despachar = despachar;

        //////////

        Despacho.contratante = JSON.parse(sessionStorage.getItem('contratante_despacho'));

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
            if(!Despacho.contratante) return Toast('Seleccione el contratante');
            var pasajeros = [];
            Despacho.sa[Despacho.conductor.id].forEach(function (solicitud) {
                pasajeros = pasajeros.concat(solicitud.pasajeros);
            })
            var data = {
                trayecto: Despacho.trayecto,
                origen: Despacho.origen.nombre,
                destino: Despacho.destino.nombre,
                estacion: Despacho.destino.codigo,
                ruta: Despacho._ruta.id,
                conductor: Despacho.conductor.id,
                vehiculo: typeof Despacho.conductor.vehiculo == 'object' ? Despacho.conductor.vehiculo.id : Despacho.conductor.vehiculo,
                contratante_identificacion: Despacho.contratante.identificacion,
                contratante_nombre: Despacho.contratante.nombre,
                pasajeros: pasajeros
            }
            OneRequest.post('viajes', data).then(function (response) {
                console.log(response)
                Despacho.loadConductores(Despacho._ruta);
            }, function (error) {
                console.log(error)
            })
        }
    }
})();
