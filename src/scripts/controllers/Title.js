angular.module('futurism')
    .controller('TitleCtrl', function($scope, $location, me, session, websites, window, errorHandler, socket) {
        'use strict';
        
        $scope.me = me;
        $scope.websites = websites;
        
        
        var sessionHandler = function(err) {
            if(err) {
                $scope.logout();
                return errorHandler.show(err);
            }
            $location.url('/lobby');
        };
        
        
        var startLogin = function(siteId) {
            websites.setSite(siteId);
            websites.lookup[siteId].checkLogin(function(err, siteLogin) {
                if(err) {
                    $scope.logout();
                    return errorHandler.show(err);
                }
                if(!siteLogin) {
                    return $scope.logout();
                }
                session.makeNew(siteLogin, sessionHandler);
            });
        };
        
        
        $scope.facebookLogin = function() {
            window.FB.login(function() {
                startLogin(websites.FACEBOOK);
            });
        };
        
        
        $scope.jiggminLogin = function() {
            startLogin(websites.JIGGMIN);
        };
        
        
        $scope.guestLogin = function() {
            startLogin(websites.GUESTVILLE);
        };
        
        
        $scope.logout = function() {
            socket.disconnect();
            session.destroy();
            websites.logout();
        };
        
        
        if(!session.data) {
            websites.pollLogins(function(err, siteLogin) {
                if(err) {
                    return false;
                }

                if(siteLogin) {
                    session.makeNew(siteLogin, function(){});
                }
            });
        }
    });