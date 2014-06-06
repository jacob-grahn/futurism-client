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
            websites.lookup[siteId].tryLogin(function(err, siteLogin) {
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
        
        
        $scope.login = function() {
            var siteId = $scope.defaultSite();
            startLogin(siteId);
        };
        
        
        $scope.selectSite = function(siteId) {
            startLogin(siteId);
        };
        
        
        $scope.defaultSite = function() {
            return websites.forceSite || websites.getSite() || websites.FACEBOOK;
        };
        
        
        $scope.logout = function() {
            socket.disconnect();
            session.destroy();
            websites.logout();
        };
        
        
        /*if(!session.data) {
            websites.pollLogins(function(err, siteLogin) {
                if(err) {
                    return false;
                }

                if(siteLogin) {
                    session.makeNew(siteLogin, function(){});
                }
            });
        }*/
    });