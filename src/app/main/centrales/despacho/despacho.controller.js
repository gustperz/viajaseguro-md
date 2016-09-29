(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('DespachoController', DespachoController);

    /** @ngInject */
    function DespachoController(Despacho, authService, SocketcSailsService){
        var vm = this;
        vm.despacho = Despacho;
        SocketcSailsService.suscribe(authService.getCurrentUser().central.id);

        //////////
    }
})();
