/**
 * Created by tav0 on 25/08/16.
 */

(function () {
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return moment(date).format('YYYY-MM-DD');
        };
        $mdDateLocaleProvider.months = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ];
        $mdDateLocaleProvider.shortMonths = [
            'Ene', 'Feb', 'Mar', 'Abr', 'Mayo', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'
        ];
        $mdDateLocaleProvider.days = [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado'
        ];
        $mdDateLocaleProvider.shortDays = [
            'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
        ];
    }
})();
