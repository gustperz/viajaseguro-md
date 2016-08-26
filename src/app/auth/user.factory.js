/**
 * Created by tav0 on 24/08/16.
 */

(function() {
    'use strict';

    angular
        .module('app.auth')
        .factory('authService', UserService);

    /** @ngInject **/
    function UserService($q, PermRoleStore, jwtHelper) {
        var currentUser = null;

        var service = {
            getCurrentUser: getCurrentUser,
            checkSession: checkSession,
            hasPermission: hasPermission,
            storeUser: storeUser
        };

        return service;

        ///////////////

        function getCurrentUser() {
            if(!currentUser && sessionStorage.getItem('jwt')){
                return storeUser(sessionStorage.getItem('jwt'));
            } else {
                return currentUser;
            }
        }

        function checkSession() {
            var jwt = sessionStorage.getItem('jwt');
            if (!jwt || jwtHelper.isTokenExpired(jwt)) {
                console.log('checkSession T_T');
                return false;
            }
            return true;
        }

        function hasPermission(roleDef) {
            var deferred = $q.defer();
            var hasPermission = false;

            // check if user has permission via its roles
            if(PermRoleStore.hasRoleDefinition(currentUser.rol)) {
                // check if the permission we are validating is in this role's permissions
                if(currentUser.rol == roleDef) {
                    hasPermission = true;
                }
            }

            // if we have permission resolve otherwise reject the promise
            if(hasPermission) {
                deferred.resolve();
            }
            else {
                deferred.reject();
            }

            // return promise
            return deferred.promise;
        }

        function storeUser(jwt) {
            sessionStorage.setItem('jwt', jwt);
            currentUser = jwtHelper.decodeToken(jwt).usuario;
            return currentUser;
        }
    }
})();