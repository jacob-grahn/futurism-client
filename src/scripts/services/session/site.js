angular.module('futurism')
    .factory('site', function(memory, $rootScope, $routeParams) {
        'use strict';
        
        var forceSite = false;
        
        var self = {
            
            getForceSite: function() {
                return forceSite;
            },
            
            setForceSite: function(site) {
                forceSite = site;
            },
            
            getSite: function() {
                memory.long.get('site');
            },
            
            setSite: function(site) {
                if(forceSite && site !== forceSite && site !== 'g') {
                    return 'site not allowed';
                }
                memory.long.set('site', site);
            }
        };
        
        $rootScope.$on('$routeChangeSuccess', function() {
            if($routeParams.site) {
                self.setForceSite($routeParams.site);
            }
        });
        
        return self;
    });