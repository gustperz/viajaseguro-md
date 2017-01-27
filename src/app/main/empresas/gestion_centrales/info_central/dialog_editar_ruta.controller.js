/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.empresas.gestion_centrales')
        .controller('EditarRutaCentralController', controller);

    /** @ngInject */
    function controller(OneRequest, Rutas, $mdDialog, ruta){
        var vm = this;
        vm.ruta = ruta;

        vm.saveRuta = saveRuta;
        vm.cancel = cancel;
        vm.deleteRoute = deleteRoute;

        //////////

        //////////

        function saveRuta() {
            OneRequest.put('rutas/'+ruta.id, ruta).then(function () {
                $mdDialog.hide(ruta);
            })
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function deleteRoute() {
            Rutas.remove(ruta).then(function () {
                $mdDialog.hide('deleted');
            });
        }

    }
})();
