(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('DespachoController', DespachoController);

    /** @ngInject */
    function DespachoController(Despacho){
        var vm = this;
        vm.despacho = Despacho;

        //////////
    }
})();
