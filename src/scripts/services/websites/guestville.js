angular.module('futurism')
    .factory('guestville', function(_) {
        'use strict';
        
        return {
            
            id: 'g',
            name: 'Guestville',
            
            checkLogin: function(callback) {
                _.delay(function() {
                    callback(null, {site: 'g'});
                });
            },
            
            logout: function() {
                
            }
        };
    });