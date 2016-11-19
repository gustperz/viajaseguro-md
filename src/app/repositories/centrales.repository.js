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

                if(!$sails['listeningPosCentral'+model.id]){

                    var last = $sails['listeningPosCentralLast'];
                    if(last) {
                        $sails.off('Central' + last + 'Cahnged');
                        $sails['listeningPosCentral' + last] = false;
                        console.log('Off:empresa'+model.empresa+'ubicacionWhacher'+model.ciudad_place_id+':posConductor');
                    }

                    $sails['listeningPosCentralLast'] = model.id;
                    $sails['listeningPosCentral'+model.id] = true;
                    console.log('On:empresa'+model.empresa+'ubicacionWhacher'+model.ciudad_place_id+':posConductor');
                    $sails.on('posConductor', function (data) {
                        console.log('posConductor');
                        cb(data);
                    });
                }
            };
        });
    }
})();
