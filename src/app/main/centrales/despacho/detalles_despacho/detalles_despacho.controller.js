(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('DetallesDespachoController', controller);

    /** @ngInject */
    function controller(Despacho, $mdDialog, Conductores, Vehiculos){
        var vm = this;
        vm.despacho = Despacho;

        vm.hide = hide;
        vm.cancel = cancel;
        vm.querySearch = querySearch;
        vm.selectedVehiclo = selectedVehiclo;

        //////////

        if(!vm.despacho.conductor.loaded){
            Conductores.get(vm.despacho.conductor.id, {populate: 'vehiculo'}).then(function (conductor) {
                vm.despacho.conductor = conductor;
                vm.despacho.conductor.nombre_completo = vm.despacho.conductor.nombres+' '+vm.despacho.conductor.apellidos;
                vm.despacho.conductor.fecha_licencia = moment(vm.despacho.conductor.fecha_licencia).format('DD-MM-YYYY');
                vm.searchText = conductor.vehiculo.placa;
                vm.despacho.conductor.loaded = true;
            });
        }

        vm.min_fi = moment().toDate();

        //////////

        function hide() {
            $mdDialog.hide();
        };

        function cancel() {
            $mdDialog.cancel();
        };

        function querySearch (query) {
            vm.vehiculos = []
            var fields = 'placa, marca, modelo, clase, codigo_vial, ntarjoperacion';
            return Vehiculos.getList({fields: fields, where:{'placa': { startsWith: query.toUpperCase() }}})
                .then(function (vehiculos) {
                    vm.vehiculos = vehiculos.length ? vehiculos.map(function (vehiculo) {
                        vehiculo.display = vehiculo.placa;
                        return vehiculo.plain();
                    }) : vm.vehiculos;
                    return vm.vehiculos;
                });
        }

        function selectedVehiclo(item) {
            if (item) vm.despacho.conductor.vehiculo = item;
        }
    }
})();
