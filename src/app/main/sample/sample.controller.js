(function ()
{
    'use strict';

    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController()
    {
        var vm = this;

        // Data
        vm.helloText = "Hello, I'm a sample page!";

        // Methods

        //////////
    }
})();
