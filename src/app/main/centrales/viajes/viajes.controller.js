/**
 * Created by jose on 14/10/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.viajes')
        .controller('ViajesController', controller);

    /** @ngInject */
    function controller(Viajes, $http, api, $window, $sce) {
        var vm = this;
        vm.viajes = null;

        // metodos
        vm.formato = formato;

        function formato(viaje) {
            var pet = {
                method: 'GET',
                url:  api + 'viajes/'+viaje.id+'/fuec',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                },
                responseType: 'arraybuffer'
            };
            $http(pet).then(function (response) {
                var file = new Blob([response.data], {type: 'application/pdf'});
                var fileURL = URL.createObjectURL(file);
                $window.open(fileURL);
            });
        }


        getViajes();
        function getViajes() {
            var campos = 'id, origen, destino, fuec, conductor, vehiculo';
            Viajes.getList({fields: campos})
                .then(function (data) {
                    vm.viajes = data;
                }, function (error) {
                    console.log(error);
                });
        }

    }
})();
