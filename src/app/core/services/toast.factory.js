/**
 * Created by tav0 on 7/06/16.
 */

(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('Toast', factory);

    /** @ngInject **/
    function factory($mdToast) {
        return function (text, position, delay, parent) {
            $mdToast.show({
                template: '' +
                '<md-toast layout="column" layout-align="center start">' +
                '<div class="md-toast-content" style="font-size: 20px">' +
                    text +
                    '<md-button class="md-icon-button" aria-label="cerrar" ng-click="closeToast()" style="margin-right: -22px">'+
                        '<md-icon md-font-icon="icon-close" style="color: grey; font-size: 12px"></md-icon>'+
                    '</md-button>'+
                '</div>' +
                '</md-toast>',
                hideDelay: delay || 7000,
                position: position || 'top right',
                parent: angular.element(document.body),
                controller: function ($scope, $mdToast) {
                    $scope.closeToast = function() {
                        $mdToast.hide();
                    }
                }
            });
        }
    }
})();
