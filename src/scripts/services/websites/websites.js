angular.module('futurism')
    .factory('websites', function($, $rootScope, $routeParams, memory, facebook, jiggmin, guestville) {
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
            
            
            getSite: function() {
                memory.long.get('site');
            },
            
            
            setSite: function(site) {
                if(self.forceSite && site !== self.forceSite && site !== 'g') {
                    return 'site not allowed';
                }
                memory.long.set('site', site);
            },
            
            
            pollLogins: function(callback) {
                var sitesToCheck;
                if(self.forceSite) {
                    sitesToCheck = [self.forceSite];
                }
                else {
                    sitesToCheck = [facebook, jiggmin];
                }
                
                var checkNext = function(sitesToCheck) {
                    if(sitesToCheck.length === 0) {
                        return callback(null, null);
                    }
                    
                    var site = sitesToCheck.shift();
                    site.checkLogin(function(err, login) {
                        if(err || !login) {
                            return checkNext();
                        }
                        else {
                            return callback(null, site);
                        }
                    });
                };
                
                checkNext(sitesToCheck);
            }
        };
        
        
        $rootScope.$on('$routeChangeSuccess', function() {
            if($routeParams.site) {
                self.forceSite = $routeParams.site;
            }
        });


        return self;

    });