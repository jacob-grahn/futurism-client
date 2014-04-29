angular.module('futurism')
    .factory('notificationListener', function(socket, lang, chat, moustache) {
        'use strict';

        
        /**
         * public interface
         * @type {{add: add}}
         */
        var self = {
            add: function(txt) {
                var msg = {txt: txt};
                chat.add(msg);
            }
        };

        
        /**
        * Listen for notifications
        * @param data
        */
        socket.$on('notify', function(data) {
            var txt = lang.notify[data.message];
            if(txt) {
                self.add(moustache.processTxt(txt, data.data));
            }
        });



        return self;

    });