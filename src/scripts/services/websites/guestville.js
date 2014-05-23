angular.module('futurism')
    .factory('guestville', function(_) {
        'use strict';
        
        var self = {
            
            id: 'g',
            name: 'Guestville',
            
            tryLogin: function(callback) {
                return self.checkLogin(callback);
            },
            
            checkLogin: function(callback) {
                _.delay(function() {
                    callback(null, {site: 'g'});
                });
            },
            
            logout: function() {
                
            }
        };
        
        return self;
    });