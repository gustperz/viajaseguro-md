/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .factory('Solicitud', factory);

    /* @ngInject */
    function factory($sails) {
        function Solicitud(data) {
            angular.extend(this, data);

            this.constructor.prototype.reject = rejectSolicitud;
            this.constructor.prototype.setAsPendiente = setPendiente;
            this.constructor.prototype.assignTo = assignTo;
        }

        return Solicitud;

        function rejectSolicitud(motivo) {
            sails({ method: 'post', url: '/solicitudes/'+this.id+'/reject', data: motivo });
        }

        function setPendiente() {
            sails({ method: 'put', url: '/solicitudes/'+this.id+'/estado', data: {estado: 'p'} });
        }

        function assignTo(conductor) {
            sails({ method: 'put', url: '/solicitudes/'+this.id+'/estado', data: {estado: 'a', conductor: conductor} });
        }

        function sails(request, cb) {
            $sails.request({
                method: request.method,
                url: request.url,
                data: request.data,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
                }
            }, cb);
        }
    }
})();

