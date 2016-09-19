(function () {
    'use strict';

    angular
        .module('app.centrales.conductores')
        .controller('CentralConductoresController', CentralConductoresController);

    /** @ngInject */
    function CentralConductoresController(Conductores) {
        var vm = this;
        vm.conductores = [];
        var campos = 'identificacion, nombres, apellidos, direccion, email, fecha_nacimiento,' +
            ' telefono, activo, imagen, fecha_licencia, nlicencia, tipo_licencia, fecha_seguroac, vehiculo,' +
            ' vehiculo.codigo_vial, vehiculo.placa, vehiculo.modelo, vehiculo.fecha_soat, vehiculo.fecha_tecnomecanica,' +
            ' vehiculo.cupos, vehiculo.cedula_propietario, vehiculo.telefono_propietario, vehiculo.color,' +
            ' vehiculo.nombre_propietario, vehiculo.soat, vehiculo.tecnomecanica';

        // Methods

        //////////
        getConductores();
        function getConductores() {
            Conductores.getList({fields: campos})
                .then(function (data) {
                    data.forEach(function (conductor) {
                        if (conductor.activo === true) {
                            vm.conductores.push(conductor);
                        }
                    });
                    vm.selected = vm.conductores[0];
                }, function (error) {
                    console.log(error);
                });
        }

        //////////

    }
})();
