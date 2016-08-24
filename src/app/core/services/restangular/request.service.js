/**
 * Created by tav0 on 6/06/16.
 */

(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('GetRequest', reposytory);

    /** @ngInject **/
    function reposytory(Restangular) {
        var service = {
            to: sendRequest,
            base: Restangular
        }
        return service;

        function sendRequest(route, params) {
            return Restangular.all(route).customGET('', params);
        }

        function base() {
            return Restangular;
        }
    }
})();
