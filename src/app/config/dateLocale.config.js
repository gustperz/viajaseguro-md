/**
 * Created by tav0 on 25/08/16.
 */

(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(config);

    /** @ngInject */
    function config($mdDateLocaleProvider) {
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
            'Ene','Feb','Mar','Abr','Mayo','Jun','Jul','Ago','Sept','Oct','Nov','Dic'
        ];
        $mdDateLocaleProvider.days = [
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
            'Domingo'
        ];
        $mdDateLocaleProvider.shortDays = [
            'Lun','Mar','Mié','Jue','Vie','Sáb','Dom'
        ];
    }
})();