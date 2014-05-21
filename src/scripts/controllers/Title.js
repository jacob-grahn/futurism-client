angular.module('futurism')
    .controller('TitleCtrl', function($scope, $location, me, session, websites, window, errorHandler) {
        'use strict';
        
        $scope.me = me;
        $scope.websites = websites;
        
        
        var sessionHandler = function(err) {
            if(err) {
                return errorHandler.show(err);
            }
            $location.url('/lobby');
        };
        
        
        $scope.facebookLogin = function() {
            window.FB.login(function(result) {
                if(result.status === 'connected') {
                    result.authResponse.site = 'f';
                    session.makeNew(result.authResponse, sessionHandler);
                }
            });
        };
    });