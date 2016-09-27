/**
 * Created by jose on 25/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.auth.perfil')
        .controller('PerfilController', PerfilController);

    /** @ngInject */
    function PerfilController(Empresas, authService, Toast, OneRequest) {
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

        vm.usuario = authService.getCurrentUser();

        function fueraDeServicio() {
            Toast('<b>Esta funcion se agregara proximamente al sistema, sea paciente.<b>')
        }

        datosEmpresa();
        function datosEmpresa() {
            Empresas.get(vm.usuario.empresa.id).then(success, error);

            function success(response) {
                vm.empresa = response;
                // informacion general
                vm.empresaIgeneral.nit = response.nit;
                vm.empresaIgeneral.nombre_corto = response.nombre_corto;
                vm.empresaIgeneral.nombre_largo = response.nombre_largo;
                vm.empresaIgeneral.direccion = response.direccion;
                vm.empresaIgeneral.telefono = response.telefono;
                // persona juridica
                vm.empresaPjuridica.pjuridica = response.pjuridica;
                // resolucion
                vm.empresaResoculicon.nresolucon = response.nresolucon;
                vm.empresaResoculicon.fecha_resolucion = new Date(response.fecha_resolucion);
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
    }
})();
