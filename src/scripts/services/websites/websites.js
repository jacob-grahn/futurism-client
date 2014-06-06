angular.module('futurism')
    .factory('websites', function($, $rootScope, $routeParams, memory, facebook, jiggmin, guestville, _) {
        'use strict';
        
        
        
        var self = {
            
            JIGGMIN: 'j',
            FACEBOOK: 'f',
            NEWGROUNDS: 'n',
            ARMOR_GAMES: 'a',
            GUESTVILLE: 'g',
            
            forceSite: null,
            
            lookup: {
                f: facebook,
                j: jiggmin,
                g: guestville
            },
            
            
            setSite: function(siteId) {
                if(self.forceSite && (siteId !== self.forceSite) && (siteId !== 'g')) {
                    return 'site not allowed';
                }
                return memory.long.set('site', siteId);
            },
            
            
            getSite: function() {
                return memory.long.get('site');
            },
            
            
            getAllowedSites: function() {
                var allowed;
                if(self.forceSite) {
                    allowed = [self.forceSite, guestville];
                }
                else {
                    allowed = [facebook, jiggmin, guestville];
                }
                return _.unique(allowed);
            },
            
            
            getSitesToPoll: function() {
                var allowed;
                var siteId = self.forceSite || self.getSite();
                if(siteId) {
                    allowed = [self.lookup[siteId]];
                }
                else {
                    allowed = [facebook, jiggmin];
                }
                return allowed;
            },
            
            
            pollLogins: function(callback) {
                var sitesToCheck = self.getSitesToPoll();
                
                var checkNext = function() {
                    if(sitesToCheck.length === 0) {
                        return callback(null, null);
                    }
                    
                    var site = sitesToCheck.shift();
                    site.checkLogin(function(err, login) {
                        if(err || !login) {
                            return checkNext();
                        }
                        else {
                            return callback(null, login, site);
                        }
                    });
                };
                
                checkNext();
            },
            
            
            logout: function() {
                //self.setSite(null);
                facebook.logout();
                jiggmin.logout();
                guestville.logout();
            }
        };
        
        
        $rootScope.$on('$routeChangeSuccess', function() {
            if($routeParams.site) {
                self.forceSite = $routeParams.site;
            }
        });


        return self;

    });