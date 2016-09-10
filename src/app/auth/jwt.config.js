(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($httpProvider, jwtOptionsProvider, api_domain) {

        jwtOptionsProvider.config({
            whiteListedDomains: [api_domain],
            tokenGetter: tokenGetter
        });

        /** @ngInject */
        function tokenGetter(options, jwtHelper, authService, api) {
            var jwt = sessionStorage.getItem('jwt')
            if (jwt && options.url.indexOf(api) === 0) {
                if (jwtHelper.isTokenExpired(jwt)) {
                    authService.refreshToken().then(function (jwt) {
                        return jwt;
                    }, function () {
                        return null;
                    })
                } else {
                    return jwt;
                }
            }
        }
        $httpProvider.interceptors.push('jwtInterceptor');
    }
})();