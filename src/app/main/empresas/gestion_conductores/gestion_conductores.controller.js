/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.empresas.gestion_conductores')
        .controller('EmpresaConductoresController', EmpresaConductoresController);

    /** @ngInject */
    function EmpresaConductoresController(OneRequest, authService) {
        var vm = this;
        vm.conductores = [];
        vm.conductoresInactivos = [];
        vm.selected = [];
        vm.n_cond_doc_venc = 0;
        vm.query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        // Methods

        //////////

        OneRequest.to('empresas/' + authService.getCurrentUser().empresa.id + '/conductores/all')
            .then(function (data) {
                data.forEach(function (conductor) {
                    if (conductor.activo === true) {
                        conductor.doc_venc = documentacionPorVencer(conductor);
                        vm.conductores.push(conductor);
                    } else {
                        vm.conductoresInactivos.push(conductor);
                    }
                });
            }, function (error) {
                console.log(error);
            });

        function documentacionPorVencer(conductor) {
            const fecha_licencia = conductor.fecha_licencia ? new Date(conductor.fecha_licencia) : null;
            const fecha_seguroac = conductor.fecha_seguroac ? new Date(conductor.fecha_seguroac) : null;
            const fecha_soat = conductor.vehiculo.fecha_soat ? new Date(conductor.vehiculo.fecha_soat) : null;
            const fecha_tecnomecanica = conductor.vehiculo.fecha_tecnomecanica ? new Date(conductor.vehiculo.fecha_tecnomecanica) : null;
            var diferencia = Math.floor((fecha_licencia - new Date()) / (1000 * 60 * 60 * 24))
            if (diferencia <= 30) {
                conductor.pv_licencia = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            diferencia = Math.floor((fecha_seguroac - new Date()) / (1000 * 60 * 60 * 24))
            if (diferencia <= 30) {
                conductor.pv_seguroac = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            diferencia = Math.floor((fecha_soat - new Date()) / (1000 * 60 * 60 * 24))
            if (diferencia <= 30) {
                conductor.pv_soat = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            diferencia = Math.floor((fecha_tecnomecanica - new Date()) / (1000 * 60 * 60 * 24))
            if (diferencia <= 30) {
                conductor.pv_tecnomecanica = true;
                vm.n_cond_doc_venc++;
                return true;
            }
            return false;
        }
        //////////
    }
})();

