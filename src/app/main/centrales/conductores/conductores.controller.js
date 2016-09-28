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
            ' telefono, activo, imagen, fecha_licencia, nlicencia, tipo_licencia, fecha_seguroac';

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
                }, function (error) {
                    console.log(error);
                });
        }

        //////////

    }
})();
