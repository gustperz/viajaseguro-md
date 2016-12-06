/**
 * Created by jose on 14/10/16.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.viajes2')
        .controller('EmpresaViajesController', controller);

    /** @ngInject */
    function controller(Viajes, $http, api, OneRequest, authService, $filter, Toast, $mdDialog) {
        var vm = this;
        // vm.viajes = {};
        vm.user = authService.getCurrentUser();
        vm.fechaInicio = new Date();
        vm.fechaFinal = new Date();
        vm.viajesEspecs = [];
        vm.viajesIntes = [];

        // metodos
        vm.formato = formato;
        vm.getViajesRango = getViajesRango;
        vm.printAllEspecial = printAllEspecial;
        vm.printAllInt = printAllInt;

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
            var desde = $filter('date')(vm.fechaInicio, 'yyyy-MM-dd');
            var hasta = $filter('date')(vm.fechaFinal, 'yyyy-MM-dd');
            // var campos = 'id,origen,destino,contrato,fuec,conductor,vehiculo';

            OneRequest.get('empresa/'+vm.user.empresa.id+'/rango_fechas_viajes?fecha_desde='+desde+'&fecha_hasta='+hasta+'&populate=conductor,vehiculo').then(function (response) {
                angular.forEach(response, function(viaje){
                    if(viaje.vehiculo.modalidad === 'especial'){
                        vm.viajesEspecs.push(viaje);
                    }else if(viaje.vehiculo.modalidad === 'intermunicipal'){
                        vm.viajesIntes.push(viaje);
                    }
                })
            })
            // Viajes.getList({fields: campos,where:{empresa: vm.user.empresa.id}, populate: 'conductor, vehiculo'})
            //     .then(function (data) {
            //         vm.viajes = data;
            //         console.log(vm.viajes)
            //     }, function (error) {
            //         console.log(error);
            //     });
        }

        function printAllEspecial(){
            if(vm.viajesEspecs.length !== 0){
                $mdDialog.show({
                    templateUrl: 'app/main/centrales/despacho/progress.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:false,
                    fullscreen: false
                });
                OneRequest.get('empresa/'+vm.user.empresa.id+'/print_all_fuec?fecha_desde='+vm.fechaInicio+'&fecha_hasta='+vm.fechaFinal, {contrato: vm.contrato}).then(function (response) {
                    var ventimp = window.open(' ', 'popimpr');
                    ventimp.document.write( response);
                    ventimp.document.close();
                    setTimeout(function () {
                        ventimp.print( );
                        ventimp.close();
                    }, 100);
                    $mdDialog.cancel();
                })
            }else{
                Toast('No existen planillas para imprimir.')
            }
        }

        function printAllInt(){
            if(vm.viajesIntes.length !== 0){
                $mdDialog.show({
                    templateUrl: 'app/main/centrales/despacho/progress.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:false,
                    fullscreen: false
                });
                OneRequest.get('empresa/'+vm.user.empresa.id+'/print_all_generic?fecha_desde='+vm.fechaInicio+'&fecha_hasta='+vm.fechaFinal).then(function (response) {
                    var ventimp = window.open(' ', 'popimpr');
                    ventimp.document.write( response);
                    ventimp.document.close();
                    setTimeout(function () {
                        ventimp.print( );
                        ventimp.close();
                    }, 100);
                    $mdDialog.cancel();
                })
            }else{
                Toast('No existen planillas para imprimir.')
            }
        }

        function getViajesRango(){
            vm.viajesEspecs = [];
            vm.viajesIntes = [];
            var dif = diferenciaEntreDiasEnDias(vm.fechaInicio, vm.fechaFinal);
            if(dif < 0){
                Toast('formato de fechas invalido, la fecha final debe ser mayor a la fecha inicial.');
            }else{
                OneRequest.get('empresa/'+vm.user.empresa.id+'/rango_fechas_viajes?fecha_desde='+vm.fechaInicio+'&fecha_hasta='+vm.fechaFinal).then(function (response) {

                    angular.forEach(response, function(viaje){
                        if (response.length <= 0) {
                            Toast('No se registraron viajes en la fecha o fechas seleccionadas');
                        } else {
                            if(viaje.vehiculo.modalidad === 'especial'){
                            vm.viajesEspecs.push(viaje);
                        }else if(viaje.vehiculo.modalidad === 'intermunicipal'){
                            vm.viajesIntes.push(viaje);
                        }
                        }
                    })
                })
            }

        }

        function diferenciaEntreDiasEnDias(a, b) {
            var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
            var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);
        }

    }
})();
