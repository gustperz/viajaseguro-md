(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig(RestangularProvider, api)
    {
        RestangularProvider.setBaseUrl(api);
        RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            var extractedData;
            // .. to look for getList operations
            extractedData = data;
            if (data.data) {
                extractedData = data.data;
                delete data.data;
                extractedData.metadata = data;
                extractedData.metadata.status = response.status;
            }
            return extractedData;
        });
    }
})();
