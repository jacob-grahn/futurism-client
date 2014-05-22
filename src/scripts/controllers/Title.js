angular.module('futurism')
    .controller('TitleCtrl', function($scope, $location, me, session, websites, window, errorHandler, socket, memory) {
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
        
        
        $scope.login = function() {
            var siteId = $scope.defaultSite();
            if(siteId === websites.FACEBOOK) {
                window.FB.login(function() {
                    startLogin(websites.FACEBOOK);
                });
            }
            else {
                startLogin(siteId);
            }
        };
        
        
        $scope.selectSite = function(siteId) {
            memory.short.set('selectedSite', siteId);
        };
        
        
        $scope.defaultSite = function() {
            return websites.forceSite || memory.short.get('selectedSite') || websites.FACEBOOK;
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