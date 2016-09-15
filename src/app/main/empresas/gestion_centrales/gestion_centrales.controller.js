/**
 * Created by Jose Soto Acosta on 26/08/2016.
 */
(function ()
{
    'use strict';

    angular
        .module('app.empresas.gestion_centrales')
        .controller('EmpresaCentralesController', EmpresaCentralesController);

    /** @ngInject */
    function EmpresaCentralesController(NavigatorGeolocation){
        var vm = this;
        var map;
        // Data
        NavigatorGeolocation.getCurrentPosition()
            .then(function(position) {
                var lat = position.coords.latitude, lng = position.coords.longitude;
                vm.simpleMap= {
                    center: [lat, lng],
                    zoom: 8
                };
                vm.my_position =  [lat, lng].toString();
            });


        vm.verticalStepper = {
            step1: {},
            step2: {},
            step3: {},
            step4: {},
            step5: {}
        };

        // Methods

        //////////
    }
})();
