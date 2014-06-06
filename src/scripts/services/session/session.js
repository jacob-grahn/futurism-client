angular.module('futurism')
    .factory('session', function($location, $rootScope, SessionResource, memory, _) {
        'use strict';

        var self = {};
        
        
        self.setToken = function(newToken) {
            memory.short.set('token', newToken);
        };
        
        
        self.getToken = function() {
            var token = memory.short.get('token');
            if(token === 'null') {
                token = null;
            }
            return token;
        };


        self.loadSession = function(token, callback) {
            SessionResource.get(
                {token: token},

                function(data) {
                    if(data.error) {
                        return callback(data.error);
                    }
                    return callback(null, data);
                },

                function(errResponse) {
                    return callback(errResponse.data);
                }
            );
        };


        self.makeNew = function(siteLogin, callback) {
            SessionResource.post(
                siteLogin,

                function(data) {
                    if(data.error) {
                        return callback(data.error);
                    }
                    
                    self.setToken(data.token);
                    self.data = data;
                    $rootScope.$broadcast('event:sessionChanged', self.data);
                    return callback(null, data);
                },

                function(errResponse) {
                    return callback(errResponse.data);
                }
            );
        };


        self.destroy = function() {
            SessionResource.delete({token: self.getToken()});
            self.setToken(null);
            self.data = null;
            $rootScope.$broadcast('event:sessionChanged', self.data);
        };


        self.renew = function(callback) {
            var token = self.getToken();
            
            if(!callback) {
                callback = function(){};
            }

            if(!token) {
                return callback('no token');
            }

            self.loadSession(token, function(err, data) {
                if(err) {
                    return callback(err);
                }

                self.data = data;
                $rootScope.$broadcast('event:sessionChanged', self.data);

                return callback(null, data);
            });

        };


        return self;
    });