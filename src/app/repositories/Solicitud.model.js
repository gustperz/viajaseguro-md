/**
 * Created by jose on 27/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.centrales.despacho')
        .factory('Solicitud', factory);

    /* @ngInject */
    function factory(SailsRequest) {
        function Solicitud(data) {
            angular.extend(this, data);

            this.constructor.prototype.reject = rejectSolicitud;
            this.constructor.prototype.setAsPendiente = setPendiente;
            this.constructor.prototype.assignTo = assignTo;
            this.constructor.prototype.finish = finish;
        }

        return Solicitud;

        function rejectSolicitud(motivo) {
            SailsRequest({ method: 'post', url: '/solicitudes/'+this.id+'/reject', data: motivo });
        }

        function setPendiente() {
            SailsRequest({ method: 'put', url: '/solicitudes/'+this.id+'/estado', data: {estado: 'p'} });
        }

        function assignTo(conductor) {
            SailsRequest({ method: 'put', url: '/solicitudes/'+this.id+'/estado', data: {estado: 'a', conductor: conductor} });
        }
    }
})();

