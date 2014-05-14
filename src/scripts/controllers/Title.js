angular.module('futurism')
    .controller('TitleCtrl', function($scope, $location, session) {
        'use strict';
        
        $scope.login = function() {
            if(!session.active) {
                session.renew();
            }
            $location.url('/lobby');
        };
    });