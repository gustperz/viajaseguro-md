/**
 * Created by tav0 on 13/09/16.
 */

(function() {
    'use strict';

    angular
        .module('app.repositories')
        .factory('Rutas', factory)
        .run(setMethod);

    /* @ngInject */
    function factory(AbstractRepository) {
        function Repository() {
            AbstractRepository.call(this, 'rutas');
        }

        AbstractRepository.extend(Repository);

        Repository.prototype.get = function (id) {
            return this.restangular.restangularizeElement(null, {id:id}, this.route);
        }

        return new Repository();
    }
    /* @ngInject */
    function setMethod(Restangular, SailsRequest, $sails, $q) {
        Restangular.extendModel('rutas', function(model) {
            model.getTurnos = getTurnos;
            model.updateTurnos = updateTurnos;
            return model;

            function getTurnos(cb){
                var deferred = $q.defer();
                SailsRequest({ method: 'get', url: '/rutas/'+model.id+'/turnos' }, function (response) {
                    if (response.code == 'OK'){
                        cb(response.data);
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });

                if(!$sails['listeningTurnosRuta'+model.id]){

                    var last = $sails['listeningTurnosRutaLast'];
                    if(last) {
                        $sails.off('turnosRuta' + last + 'Cahnged');
                        $sails['listeningTurnosRuta' + last] = false;
                        console.log('Off:listeningTurnosRuta'+last);
                    }

                    $sails['listeningTurnosRutaLast'] = model.id;
                    $sails['listeningTurnosRuta'+model.id] = true;
                    console.log('On:listeningTurnosRuta'+model.id);
                    $sails.on('turnosRuta'+model.id+'Changed', function (turnos) {
                        console.log('turnosRuta'+model.id+'Changed');
                        cb(turnos);
                    });
                }

                return deferred.promise;
            };

            function updateTurnos(turnos) {
                return model.post('turnos', {turnos: turnos});
            }
        });
    }
})();
