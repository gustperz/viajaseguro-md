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
        function tokenGetter(options, jwtHelper, $http, api) {
            var jwt = sessionStorage.getItem('jwt');
            // console.log(options.url);
            if (jwt && options.url.indexOf(api) === 0) {
                if (jwtHelper.isTokenExpired(jwt)) {
                    return $http({
                        url: api + 'new_token',
                        skipAuthorization: true,
                        method: 'GET',
                        headers: {Authorization: 'Bearer ' + jwt},
                    }).then(function (response) {
                        sessionStorage.setItem('jwt', response.data.token);
                        return response.data.token;
                    }, function (response) {
                        sessionStorage.removeItem('jwt');
                    });
                } else {
                    return jwt;
                }
            }
        }
        $httpProvider.interceptors.push('jwtInterceptor');
    }
})();