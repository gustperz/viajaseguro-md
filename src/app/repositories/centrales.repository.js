/**
 * Created by tav0 on 13/09/16.
 */

(function() {
    'use strict';

    angular
        .module('app.repositories')
        .factory('Centrales', factory)
        .run(setMethod);

    /* @ngInject */
    function factory(RepositoriesFactory) {

        return new RepositoriesFactory.new('centrales');
    }
    /* @ngInject */
    function setMethod(Restangular, SailsRequest, $sails, $q) {
        Restangular.extendModel('centrales', function(model) {
            model.posConductores = posConductores;
            return model;

            function posConductores(cb){
                SailsRequest({ 
                    method: 'get', 
                    url: '/empresas/'+model.empresa+'/join_ubicacion_conductores/'+model.ciudad_place_id 
                }, function (response) {
                    if (response.code == 'OK'){
                        
                    } else {
                        console.log(response);
                    }
                });

                if(!$sails['listeningPos'+model.ciudad_place_id]){

                    var last = $sails['listeningPosLast'];
                    if(last) {
                        $sails.off('posConductores'+last);
                        $sails['listeningPos' + last] = false;
                        console.log('Off:empresa'+model.empresa+'ubicacionWhacher:posConductores'+model.ciudad_place_id);
                    }

                    $sails['listeningPosLast'] = model.ciudad_place_id;
                    $sails['listeningPos'+model.ciudad_place_id] = true;
                    console.log('On:empresa'+model.empresa+'ubicacionWhacher:posConductores'+model.ciudad_place_id);
                    $sails.on('connect', function(response){
                        console.log('connect',response)
                    })
                    $sails.on('posConductores'+model.ciudad_place_id, function (data) {
                        console.log('posConductores'+model.ciudad_place_id);
                        cb(data);
                    });
                }
            };
        });
    }
})();
