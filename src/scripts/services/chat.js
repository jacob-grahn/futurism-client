angular.module('futurism')
    .factory('chat', function(socket, subscriber) {
        'use strict';

        var roomName;


        /**
         * Listen for incoming chat messages
         */
        socket.$on('chat', function(msg) {
            if(msg.roomName === roomName) {
                self.add(msg);
            }
        });


        /**
         * Listen for incoming chatHistory
         */
        socket.$on('chatHistory', function(data) {
            if(data.roomName === roomName) {
                for(var i=0; i<data.history.length; i++) {
                    var msg = data.history[i];
                    self.add(msg);
                }
            }
        });



        /**
         * public interface
         */
        var self = {

            maxMsgs: 35,
            msgs: [],
            receivedCount: 0,


            /**
             * leave old chat room, and join another
             * @param _roomName_
             */
            join: function(_roomName_) {
                if(roomName) {
                    self.unsubscribe(roomName);
                }
                roomName = _roomName_;

                self.clear();
                self.subscribe(roomName);
            },


            /**
             * reset
             */
            clear: function() {
                self.msgs = [];
                self.receivedCount = 0;
            },


            /**
             * Start listening room
             */
            subscribe: function(roomName) {
                subscriber.subscribe(roomName);
                socket.emit('chatHistory', {roomName: roomName});
            },


            /**
             * Stop listening room
             */
            unsubscribe: function(roomName) {
                subscriber.unsubscribe(roomName);
            },


            /**
             * Send a text message off to the chat server
             * @param {string} txt
             */
            send: function(txt) {
                if(txt.indexOf('/report') === 0) {
                    socket.emit('reportChat', {roomName: roomName, note: txt.substr(8)});
                }
                else {
                    socket.emit('chat', {roomName: roomName, txt: txt});
                }
            },


            /**
             * Add a chat to the msgs array
             * @param {object} msg
             */
            add: function(msg) {
                self.receivedCount++;
                self.msgs.push(msg);
                self.prune(self.msgs, self.maxMsgs);
            },


            /**
             * Remove old chat messages
             */
            prune: function(msgs, max) {
                while(msgs.length > max) {
                    msgs.shift();
                }
            }


        };

        return self;

    });