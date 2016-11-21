/**
 * Created by jose on 25/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.tracking')
        .controller('TrackingController', TrackingController);

    /** @ngInject */
    function TrackingController(Centrales, NavigatorGeolocation, NgMap, $timeout) {
        // variables
        var vm = this;
        var ciudad_place = undefined;
        vm.markers = [];
        var markersIndex = [];
        var markersTimer = {};
        
        // metodos
        vm.trackingCentral = trackingCentral;

        //////////

        loadCentrales();
        currentPos();

        NgMap.getMap().then(function(map) {
            vm.map = map;
        });

        //////////

        function loadCentrales() {
            Centrales.getList({fields: 'id, ciudad, direccion, pos_lat, pos_lng, ciudad_place_id, empresa'}).then(function (centrales) {
                vm.centrales = centrales;
            })
        }        

        function currentPos() {
            NavigatorGeolocation.getCurrentPosition()
                .then(function(position) {
                    var lat = position.coords.latitude, lng = position.coords.longitude;
                    vm.simpleMap = {
                        center: [lat, lng],
                        zoom: 7
                    };
                });
        }

        function trackingCentral(central) {
            vm.selectCentral = central;
            vm.selectCentral.pos = [central.pos_lat, central.pos_lng];
            vm.map.panTo({lat: parseFloat(central.pos_lat), lng: parseFloat(central.pos_lng)});
            vm.map.setZoom(10);
            //vm.simpleMap.center = [central.pos_lat, central.pos_lng];
            //vm.simpleMap.zoom = 9;
            
            central.posConductores(function(data) {
                if (markersIndex[data.id] >= 0) {
                    vm.markers[markersIndex[data.id]].pos = [data.lat, data.lng];
                    $timeout.cancel(markersTimer[data.id]);
                    setTimer(data.id);
                } else {
                    vm.markers.push({
                        pos: [data.lat, data.lng],
                        codigo: data.codigo_vial
                    });
                    markersIndex[data.id] = vm.markers.length - 1;
                    setTimer(data.id);
                }
            });

            function setTimer (id) {
                markersTimer[id] = $timeout(function(){
                    vm.markers.splice(markersIndex[id], 1);
                    markersIndex[id] = -1;
                }, 5*1000);
            }
        }

    }
})();
