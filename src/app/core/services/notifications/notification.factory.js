/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('Notify', NotifitationFactory);

    /* @ngInject */
    function NotifitationFactory(Toast) {
        return function (data) {
            var options = {
                body: data.message
            };
            var notificacion = new Notification(data.tittle, options);
            if ('Notification' in window) {
                setTimeout(notificacion.close.bind(notificacion), 10000);
            } else {
                Toast(data.message);
            }
        }
    }
})();
