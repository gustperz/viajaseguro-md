(function ()
{
    'use strict';

    angular
        .module('app.centrales.despacho')
        .controller('DespachoController', DespachoController);

    /** @ngInject */
    function DespachoController(Despacho, $mdDialog){
        var vm = this;
        vm.despacho = Despacho;

        vm.detalles = detalles;

        //////////

        //////////

        function detalles(event) {
            $mdDialog.show({
                controller: 'DetallesDespachoController as vm',
                templateUrl: 'app/main/centrales/despacho/detalles_despacho/detalles_despacho.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose:true,
                fullscreen: true// Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        }
    }
})();
