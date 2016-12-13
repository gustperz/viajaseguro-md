/**
 * Created by jose on 14/10/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.viajes')
        .controller('ViajesController', controller);

    /** @ngInject */
    function controller(Viajes, $http, api, OneRequest, authService, $filter) {
        var vm = this;
        // vm.viajes = {};
        vm.user = authService.getCurrentUser();
        vm.viajesEspecs = [];
        vm.viajesIntes = [];
        vm.fechaInicio = new Date();
        vm.fechaFinal = new Date();

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
                    // ventimp.focus();
                }, 10);



                // var file = new Blob([response.data], {type: 'application/pdf'});
                // var fileURL = URL.createObjectURL(file);
                // $window.open(fileURL);
            });
        }


        getViajes();
        function getViajes() {
            var desde = $filter('date')(vm.fechaInicio, 'yyyy-MM-dd');
            var hasta = $filter('date')(vm.fechaFinal, 'yyyy-MM-dd');
            var campos = 'id,origen,destino,contrato,fuec,conductor,vehiculo';

            // OneRequest.get('viajes?fields='+campos+'&populate=conductor,vehiculo&where={central:'+vm.user.central.id+'}').then(function (response) {
            //     vm.viajes = response;
            // })
            OneRequest.get('empresa/'+vm.user.empresa.id+'/rango_fechas_viajes?fecha_desde='+desde+'&fecha_hasta='+hasta+'&populate=conductor,vehiculo', {where: {central: vm.user.central.id}}).then(function (response) {
                angular.forEach(response, function(viaje){
                    if(viaje.modalidad === 'especial'){
                        vm.viajesEspecs.push(viaje);
                    }else if(viaje.modalidad === 'intermunicipal'){
                        vm.viajesIntes.push(viaje);
                    }
                })
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
