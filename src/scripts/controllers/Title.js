angular.module('futurism')
    .controller('TitleCtrl', function($scope, $location, session, sound) {
        'use strict';

        sound.play('win');
        
        $scope.login = function() {
            if(!session.active) {
                session.renew();
            }
            $location.url('/lobby');
        };
    });