angular.module('futurism')
    .factory('socketAuthenticator', function(session, _) {
        'use strict';

        var setup = function(socket) {

            var buffer = [];
            var authenticated = false;
            var reAuthDelay = 3000;

            var sendAuth = function() {
                socket.emit('auth', {token: session.getToken()});
            };

            var flushBuffer = function() {
                _.each(buffer, function(event) {
                    socket.authEmit(event.eventName, event.data);
                });
                buffer = [];
            };

            socket.on('disconnect', function() {
                authenticated = false;
            });

            socket.on('connect', function() {
                console.log('on connect');
                authenticated = false;
                sendAuth();
            });

            socket.on('authFail', function() {
                _.delay(sendAuth, reAuthDelay);
                reAuthDelay += 1000;
            });

            socket.on('ready', function() {
                authenticated = true;
                reAuthDelay = 3000;
                flushBuffer();
            });

            socket.authEmit = function(eventName, data) {
                if(authenticated) {
                    console.log('emit', eventName, data);
                    socket.emit(eventName, data);
                }
                else {
                    console.log('buffer', eventName, data);
                    buffer.push({eventName:eventName, data:data});
                }
            };
        };

        return setup;
    });