(function ()
{
    'use strict';

    angular
        .module('app.centrales.conductores')
        .controller('CentralConductoresController', CentralConductoresController);

    /** @ngInject */
    function CentralConductoresController(OneRequest, authService)
    {
        var vm = this;
         vm.conductores = null;

        // Methods

        //////////

        OneRequest.to('empresas/' + authService.getCurrentUser().central.empresa.id + '/conductores/all')
            .then(function (data) {
                vm.conductores = data;
            }, function (error) {
                console.log(error);
            });

        //////////

    }
})();
