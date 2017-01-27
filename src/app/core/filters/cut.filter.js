/**
 * Created by tav0 on 26/01/2017.
 */
(function() {
    'use strict';

    angular
        .module('app.core')
        .filter('cut', cut);

    function cut() {
        return function (value, max, tail) {
            if (!value) {
                return '';
            }

            max = parseInt(max, 10);
            if (!max) {
                return value;
            }
            if (value.length <= max) {
                return value;
            }

            value = value.substr(0, max);

            return value + (tail || ' …');
        }
    }

})();
