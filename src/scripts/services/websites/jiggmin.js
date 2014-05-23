angular.module('futurism')
    .factory('jiggmin', function($, memory) {
        'use strict';
        
        var self = {
            
            id: 'j',
            name: 'Jiggmin',
            
            tryLogin: function(callback) {
                return self.checkLogin(callback);
            },
            
            checkLogin: function(callback) {
                if(memory.long.get('site') !== 'j') {
                    return callback('Jiggmin is not the selected site');
                }
                
                $.ajax('https://jiggmin.com/-who-am-i.php', {
                    type: 'GET',
                    dataType: 'jsonp',
                    xhrFields: {
                        withCredentials: true
                    }
                })
                .done(function(data) {
                    if(data.logged_in) {
                        data.site = 'j';
                        return callback(null, data);
                    }
                    else {
                        return callback('not logged into jiggmin.com');
                    }
                })
                .error(callback);
            },
            
            logout: function() {
                
            }
        };
        
        return self;
    });