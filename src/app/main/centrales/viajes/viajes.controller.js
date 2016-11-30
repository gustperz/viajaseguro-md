/**
 * Created by jose on 14/10/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.viajes')
        .controller('ViajesController', controller);

    /** @ngInject */
    function controller(Viajes, $http, api, OneRequest, authService) {
        var vm = this;
        // vm.viajes = {};
        vm.user = authService.getCurrentUser();

        // metodos
        vm.formato = formato;

        function formato(viaje) {
            var pet = {
                method: 'GET',
                url:  api + 'viajes/'+viaje.id+'/fuec',
                // headers: {
                    // 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt'),
                    // 'Content-Type': 'application/pdf',
                    // 'Content-Type': 'application/json'
                // },
                // responseType: 'arraybuffer'
            };
            $http(pet).then(function (response) {
                // var ficha = document.getElementById(nombre);
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
            });
        }


        getViajes();
        function getViajes() {
            var campos = 'id,origen,destino,contrato,fuec,conductor,vehiculo';

            OneRequest.get('viajes?fields='+campos+'&populate=conductor,vehiculo&where={central:'+vm.user.central.id+'}').then(function (response) {
                vm.viajes = response;
            })
            // Viajes.get({fields: campos, where:{central: vm.user.central.id}, populate: 'conductor, vehiculo'})
            //     .then(function (response) {
            //         vm.viajes = response;
            //         console.log(vm.viajes)
            //     }, function (error) {
            //         console.log(error);
            //     });
        }

    }
})();
