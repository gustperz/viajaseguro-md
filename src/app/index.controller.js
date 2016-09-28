(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, NotifitationFactory)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        //////////
        // permiso de notificaciones
        NotifitationFactory.requestPermission();
    }
})();