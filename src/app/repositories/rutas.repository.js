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
                if(!$sails['listeningTurnosRuta'+model.id]){
                    SailsRequest({ method: 'get', url: '/rutas/'+model.id+'/turnos' }, function (response) {
                        if (response.code == 'OK'){
                            cb(response.data);
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    });

                    var last = $sails['listeningTurnosRutaLast'];
                    if(last) {
                        $sails.off('turnosRuta' + last + 'Cahnged');
                        $sails['listeningTurnosRuta' + last] = false;
                    }

                    $sails['listeningTurnosRutaLast'] = model.id;
                    $sails['listeningTurnosRuta'+model.id] = true;
                    $sails.on('turnosRuta'+model.id+'Cahnged', function (turnos) {
                        console.log('turnosRuta'+model.id+'Cahnged');
                        cb(turnos);
                    });
                } else deferred.reject();
                return deferred.promise;
            };

            function updateTurnos(turnos) {
                console.log(turnos)
                return model.post('turnos', {turnos: turnos});
                // var deferred = $q.defer();
                // SailsRequest({
                //     method: 'post',
                //     url: '/rutas/'+model.id+'/turnos',
                //     data: {turnos: turnos}
                // }, function (response) {
                //     if (response.code == 'OK'){
                //         deferred.resolve();
                //     } else {
                //         deferred.reject();
                //     }
                // });
                // return deferred.promise;
            }
        });
    }
})();
