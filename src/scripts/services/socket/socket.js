angular.module('futurism')
    .factory('socket', function(_, io, errorHandler, $rootScope, socketAuthenticator, servers) {
        'use strict';

        var socket;
        var listeners = [];
        var uri;
        var buffer = [];


        var applyListener = function(socket, obj) {

            var event = obj.event;
            var listener = obj.listener;

            var wrappedListener = function(data) {
                $rootScope.$apply(function() {
                    console.log('rec ' + event + ': ' + JSON.stringify(data));
                    try {
                        listener(data);
                    }
                    catch(err) {
                        errorHandler.fatal(err);
                    }
                });
            };

            obj.wrappedListener = wrappedListener;
            socket.on(event, wrappedListener);
        };


        var applyListeners = function(socket) {
            _.each(listeners, function(obj) {
                applyListener(socket, obj);
            });
        };


        var removeListeners = function(socket) {
            _.each(listeners, function(obj) {
                socket.removeAllListeners(obj.event);
            });
        };


        var flushBuffer = function() {
            if(socket) {
                _.each(buffer, function(obj) {
                    socket.authEmit(obj.event, obj.data);
                });
            }
            buffer = [];
        };


        var self = {
            

            /**
             * connect to a game server
             * @param {Number} serverId
             */
            connect: function(serverId) {

                serverId = Number(serverId);

                // lookup server uri with the serverId
                servers.getUri(serverId, function(err, newUri) {
                    if(err) {
                        return false;
                    }

                    // connect to the server
                    if(uri !== newUri) {
                        self.disconnect();

                        uri = newUri;
                        socket = io.connect(uri);
                        if(socket.authEmit) {
                            //socket.socket.connect();
                        }
                        else {
                            socketAuthenticator(socket);
                        }

                        applyListeners(socket);
                        flushBuffer();
                    }
                });
            },

            disconnect: function() {
                if(socket) {
                    removeListeners(socket);
                    //socket.disconnect();
                    socket = null;
                    uri = null;
                }
            },

            emit: function(event, data) {
                if(socket) {
                    socket.authEmit(event, data);
                }
                else {
                    buffer.push({event: event, data: data});
                }
            },

            $on: function(event, listener) {
                var obj = {event: event, listener: listener};
                listeners.push(obj);
                if(socket) {
                    applyListener(socket, obj);
                }
            },

            $off: function(event, listener) {
                listeners = _.filter(listeners, function(obj) {
                    if(obj.event === event && obj.listener === listener) {
                        if(socket) {
                            socket.removeListener(event, obj.wrappedListener);
                        }
                        return false;
                    }
                    return true;
                });
            }
        };

        return self;

    });