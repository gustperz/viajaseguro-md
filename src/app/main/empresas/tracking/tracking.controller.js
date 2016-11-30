/**
 * Created by jose on 25/09/16.
 */
(function () {
    'use strict';

    angular
        .module('app.tracking')
        .controller('TrackingController', TrackingController);

    /** @ngInject */
    function TrackingController(Centrales, NavigatorGeolocation, NgMap, $timeout, $rootScope, Conductores) {
        // variables
        var vm = this;
        var ciudad_place = undefined;
        vm.markers = [];
        var markersIndex = [];
        var markersTimer = {};
        var route_directions = [];
        vm.centrales_markers = [];
        
        vm.marker_vehiculo = {
            url:'assets/images/marker_vehiculo.png', 
            //size: new google.maps.Size(20, 32)
        }
        
        // metodos
        vm.trackingCentral = trackingCentral;
        vm.showInfo = showInfo;

        //////////

        loadCentrales();
        currentPos();

        NgMap.getMap().then(function(map) {
            vm.map = map;
            google.maps.event.addListener(map, "idle", function(){
                google.maps.event.trigger(map, 'resize'); 
            }); 
        });

        //////////

        function loadCentrales() {
            Centrales.getList({fields: 'id, ciudad, direccion, pos_lat, pos_lng, ciudad_place_id, empresa'})
            .then(function (centrales) {
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

        function showInfo(event, marker) {
            if (this.getAnimation() != null) {
                this.setAnimation(null);
                vm.conductor = undefined;                
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
                if(!marker.conductor) {
                    Conductores.get(marker.id).then(function (conductor) {
                        marker.conductor = {
                            nombre: conductor.nombres+' '+conductor.apellidos,
                            estado: conductor.estado,
                            imagen: conductor.imagen,
                            identificacion: conductor.identificacion,
                            id: conductor.id
                        };
                        vm.conductor = marker.conductor;          
                    });
                } else {
                    vm.conductor = marker.conductor;
                }
            }
        }

        function trackingCentral(central) {
            vm.markers = [];
            var markersIndex = [];
            var markersTimer = {};
            
            vm.selectCentral = central;
            vm.selectCentral.pos = [central.pos_lat, central.pos_lng];
            vm.map.panTo({lat: parseFloat(central.pos_lat), lng: parseFloat(central.pos_lng)});
            vm.map.setZoom(9);
            //vm.simpleMap.center = [central.pos_lat, central.pos_lng];
            //vm.simpleMap.zoom = 9;

            showRoutes(central);
            
            central.posConductores(function(data) {
                if (markersIndex[data.id] >= 0) {
                    vm.markers[markersIndex[data.id]].pos = [data.lat, data.lng];
                    $timeout.cancel(markersTimer[data.id]);
                    setTimer(data.id);
                } else {
                    vm.markers.push({
                        id: data.id,
                        pos: [data.lat, data.lng],
                        codigo: {text: data.codigo_vial, color: 'white', fontWeight: '500'}
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

        function showRoutes(central) {
            vm.centrales_markers = [];
            angular.forEach(route_directions, function(direction){
                direction.setMap(null);
            });
            route_directions = [];
            central.getList('rutas').then(function (rutas) {
                angular.forEach(rutas, function(ruta){
                    printPoliline(central, ruta);
                });
            });
        }

        function printPoliline(central, ruta){
            var request = {
                origin:{placeId: ruta.destino.ciudad_place_id},
                destination: {lat: parseFloat(central.pos_lat), lng: parseFloat(central.pos_lng)},
                travelMode: google.maps.TravelMode.DRIVING
            };
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsService.route(request, function (directions, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setOptions({
                        preserveViewport: true,
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: '#D50000',
                            strokeOpacity: 0.5
                        }
                    });
                    directionsDisplay.setMap(vm.map);
                    directionsDisplay.setDirections(directions);
                    route_directions.push(directionsDisplay);
                    
                    var location = directions.routes[ 0 ].legs[ 0 ].start_location;
                    vm.centrales_markers.push({
                        pos: [location.lat(), location.lng()]
                    });
                    console.log(vm.centrales_markers)

                    vm.distancia = directions.routes[0].legs[0].distance.text;
                    vm.tiempo = directions.routes[0].legs[0].duration.text;;
                }
            });
        }

    }
})();
