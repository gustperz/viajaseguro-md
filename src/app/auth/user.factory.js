/**
 * Created by tav0 on 24/08/16.
 */

(function() {
    'use strict';

    angular
        .module('app.auth')
        .factory('authService', UserService);

    /** @ngInject **/
    function UserService($q, PermRoleStore, jwtHelper, $http, api) {
        var currentUser = null;

        var service = {
            getCurrentUser: getCurrentUser,
            checkSession: checkSession,
            refreshToken: refreshToken,
            hasPermission: hasPermission,
            storeUser: storeUser
        };

        return service;

        ///////////////

        function getCurrentUser() {
            if(!currentUser && sessionStorage.getItem('jwt')){
                return storeUser(sessionStorage.getItem('jwt'), sessionStorage.getItem('user'));
            } else {
                return currentUser;
            }
        }

        function checkSession() {
            var jwt = sessionStorage.getItem('jwt');
            if(!jwt) return false;
            if(jwtHelper.isTokenExpired(jwt)) return 'expired';
            return true;
        }

        function refreshToken() {
            var deferred = $q.defer();
            var promisse = $http({
                url: api + 'new_token',
                skipAuthorization: true,
                method: 'GET',
                headers: {Authorization: 'Bearer ' + jwt},
            });
            promisse.then(function (response) {
                sessionStorage.setItem('jwt', response.data.token);
                deferred.resolve(response.data.token);
            }, function () {
                sessionStorage.removeItem('jwt');
                deferred.reject();
            });
            return deferred.promise;
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

        function storeUser(jwt, user) {
            sessionStorage.setItem('jwt', jwt);
            sessionStorage.setItem("user", JSON.stringify(user));
            currentUser = JSON.parse(sessionStorage.getItem('user')); 
            return currentUser;
        }
    }
})();