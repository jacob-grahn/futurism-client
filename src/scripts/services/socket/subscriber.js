angular.module('futurism')
    .factory('subscriber', function(_, socket) {
        'use strict';
        
        var subs = [];
        
        
        var self = {
            
            subscribe: function(room) {
                subs.push(room);
                subs = _.unique(subs);
                socket.emit('subscribe', room);
            },
            
            unsubscribe: function(room) {
                _.pull(subs, room);
                socket.emit('unsubscribe', room);
            },
            
            resubscribe: function() {
                _.each(subs, function(room) {
                    socket.emit('subscribe', room);
                });
            },
            
            unsubscribeAll: function() {
                _.each(subs, function(room) {
                    socket.emit('unsubscribe', room);
                });
                subs = [];
            }
        };
        
        
        socket.$on('connect', function() {
            self.resubscribe();
        });
        
        
        return self;
    });