/**
 * Created by jose on 25/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.perfil')
        .controller('PerfilController', PerfilController);

    /** @ngInject */
    function PerfilController(Empresas, authService, Toast, OneRequest, api, $http) {
        // variables
        var vm = this;
        vm.empresaIgeneral = {};
        vm.empresaResoculicon = {};
        vm.empresaPjuridica = {};
        vm.user = {};
        // metodos
        vm.fueraDeServicio = fueraDeServicio;
        vm.modificarInfoGeneral = modificarInfoGeneral;
        vm.modificarPjuridica = modificarPjuridica;
        vm.modificarResolucion = modificarResolucion;
        vm.updateContrasena = updateContrasena;
        vm.guardarLogo = guardarLogo;
        vm.guardarFirmaDigital = guardarFirmaDigital;

        vm.usuario = authService.getCurrentUser();

        vm.dirterr = [
            {num: '305', nombre: 'Antioquia, Chocó '},
            {num: '208', nombre: 'Atlántico'},
            {num: '213', nombre: 'Bolívar, San Andrés y Providencia'},
            {num: '415', nombre: 'Boyacá, Casanare'},
            {num: '317', nombre: 'Caldas'},
            {num: '319', nombre: 'Cauca'},
            {num: '220', nombre: 'César'},
            {num: '223', nombre: 'Córdoba, Sucre'},
            {num: '425', nombre: 'Cundinamarca'},
            {num: '241', nombre: 'La Guajira'},
            {num: '441', nombre: 'Huila, Caquetá'},
            {num: '247', nombre: 'Magdalena'},
            {num: '550', nombre: 'Meta, Vaupés, Vichada'},
            {num: '352', nombre: 'Nariño, Putumayo'},
            {num: '454', nombre: 'Norte de Santander, Arauca'},
            {num: '363', nombre: 'Quindío'},
            {num: '366', nombre: 'Risaralda'},
            {num: '468', nombre: 'Santander'},
            {num: '473', nombre: 'Tolima'},
            {num: '376', nombre: 'Valle del Cauca'},
        ]

        //////////

        datosEmpresa();

        //////////

        function fueraDeServicio() {
            Toast('<b>Esta funcion se agregara proximamente al sistema, sea paciente.<b>')
        }

        function datosEmpresa() {
            Empresas.get(vm.usuario.empresa.id).then(success, error);

            function success(response) {
                vm.empresa = response;
                // informacion general
                vm.empresaIgeneral.nit = vm.empresa.intermunicipal ? vm.empresa.nit_intermunicipal : vm.empresa.nit_especial;
                if(vm.empresa.intermunicipal && vm.empresa.especial && vm.empresa.nit_intermunicipal != vm.empresa.nit_espcial) {
                    vm.empresaIgeneral.nit = false;
                }
                vm.empresaIgeneral.nombre_corto = response.nombre_corto;
                vm.empresaIgeneral.nombre_largo = response.nombre_largo;
                vm.empresaIgeneral.direccion = response.direccion;
                vm.empresaIgeneral.telefono = response.telefono;
                vm.empresaIgeneral.fax = response.fax;
                // persona juridica
                vm.empresaPjuridica.pjuridica = response.pjuridica;
                vm.empresaPjuridica.nombre_pjuridica = response.nombre_pjuridica;
                // resolucion
                vm.empresaResoculicon.nresolucon = response.nresolucon;
                vm.empresaResoculicon.fecha_resolucion = moment(response.fecha_resolucion).toDate();
                vm.empresaResoculicon.ndireccion_terr = response.ndireccion_terr;
            }

            function error(response) {
                console.log('Algun error')
            }
        }

        function modificarInfoGeneral() {
            vm.empresa.put(vm.empresaIgeneral).then(success, error);
            function success(response) {
                Toast('Informacion general actualizada correctamente');
            }
            function error(response) {
                Toast('Ocurrio algun error durante la actualizacion, verifica los datos eh intentalo denuevo.')
            }
        }

        function modificarPjuridica() {
            vm.empresa.put(vm.empresaPjuridica).then(success, error);
            function success(response) {
                Toast('Persona juridica actualziada correctamente');
            }
            function error(response) {
                Toast('Ocurrio algun error durante la actualizacion, verifica los datos eh intentalo denuevo.')
            }
        }

        function modificarResolucion() {
            vm.empresa.put(vm.empresaResoculicon).then(success, error);
            function success(response) {
                Toast('Datos de resolucion actualizados correctamente');
            }
            function error(response) {
                Toast('Ocurrio algun error durante la actualizacion, verifica los datos eh intentalo denuevo.')
            }
        }

        function updateContrasena() {
            if(vm.user.password == vm.confirmPassword){
             update();
            }else{
                Toast('Las contrase&ntilde;a no son iguales')
            }

        }

        function update() {
            OneRequest.put('user/'+vm.usuario.id+'/updateContrasena', vm.user).then(success, error);

            function success(response) {
                vm.user = {};
                vm.confirmPassword = null;
                Toast('Contrase&ntilde;a actualizada correctamente')
            }

            function error(response) {
                console.log('Algun error')
            }
        }

        function guardarFirmaDigital() {
            if (vm.firmaDigital) {
                if(saveFirma().$$state.status != 0){
                    Toast('Error al subir la firma');
                }else{
                    Toast('Firma guardada correctamente');
                }
            }else{
                console.log('Firma no se creo');
            }
        }

        function guardarLogo() {
            if (vm.logo) {
                if(saveLogo().$$state.status != 0){
                    Toast('Error al subir el logo');
                }else{
                    Toast('Logo guardado correctamente, podra visualizarlo en su proximo inicio de sesion');
                }
            }else{
                console.log('vm.logo no se creo');
            }
        }

        function saveLogo() {
            var data = new FormData();
            data.append('logo', vm.logo);

            return $http.post(
                api + 'empresas/' + vm.usuario.empresa.id + '/logo', data,
                {
                    transformRequest: angular.identity, headers: {'Content-Type': undefined}
                }
            );
        }

        function saveFirma() {
            var data = new FormData();
            data.append('firmaDigital', vm.firmaDigital);

            return $http.post(
                api + 'empresas/' + vm.usuario.empresa.id + '/firma', data,
                {
                    transformRequest: angular.identity, headers: {'Content-Type': undefined}
                }
            );
        }

    }
})();
