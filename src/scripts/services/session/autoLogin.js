angular.module('futurism')
    .factory('autoLogin', function($location, $rootScope, authService, session, websites) {
        'use strict';
        
        var self = {};
        var removeListener;
        var autologinInProgress;

        
        /**
         * Try everything possible to get a valid login
         * pretty complex, but I can't think of a way to simplify at the moment
         */
        var loginAtAllCosts = function() {
            
            // don't have more than one thread going at a time
            if(autologinInProgress) {
                return 'already trying to autologin';
            }
            autologinInProgress = true;
            
            // try to renew our existing session if we have one
            session.renew(function(error) {
                if(error) {
                    
                    // check if we're logged into any sites
                    return websites.pollLogins(function(err, siteLogin) {
                        
                        // log into guestville if not logged into any real site
                        if(err || !siteLogin) {
                            siteLogin = {site: websites.GUESTVILLE};
                        }
                        
                        // try to create a new session
                        return session.makeNew(siteLogin, function(err, session) {
                            
                            // utter failure
                            if(err || !session) {
                                autologinInProgress = false;
                                return $location.path('/');
                            }
                            
                            // creating a new session worked
                            autologinInProgress = false;
                            return authService.loginConfirmed(null);
                        });
                    });
                }
                
                // renewing the session worked
                autologinInProgress = false;
                return authService.loginConfirmed(null);
            });
        };

        
        /**
         * Turn on autologin
         */
        self.activate = function() {
            if(!removeListener) {
                removeListener = $rootScope.$on('event:auth-loginRequired', loginAtAllCosts);
            }
            loginAtAllCosts();
        };

        
        /**
         * Turn off autologin
         */
        self.deactivate = function() {
            if(removeListener) {
                removeListener();
                removeListener = null;
            }
        };

        
        return self;
    });